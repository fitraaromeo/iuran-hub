<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\House;
use App\Models\HouseResidentHistory;
use App\Models\FeeType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments/bills, with optional filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['house', 'residence', 'feeType']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        if ($request->filled('house_id')) {
            $query->where('house_id', $request->house_id);
        }

        if ($request->filled('residence_id')) {
            $query->where('residence_id', $request->residence_id);
        }

        if ($request->filled('fee_type_id')) {
            $query->where('fee_type_id', $request->fee_type_id);
        }

        $payments = $query->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->paginate($request->query('per_page', 10));

        return response()->json([
            'message' => 'Payments retrieved successfully.',
            'data' => $payments
        ]);
    }

    /**
     * Store a newly created bill/payment record.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'house_id' => 'required|uuid|exists:house,id',
            'residence_id' => 'nullable|uuid|exists:residence,id',
            'fee_type_id' => 'required|uuid|exists:fee_type,id',
            'amount' => 'nullable|numeric|min:0',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
            'status' => 'nullable|string|in:unpaid,paid',
        ]);

        $house = House::with('currentOccupant')->find($validated['house_id']);

        // Auto-detect resident if not provided
        if (empty($validated['residence_id'])) {
            if (!$house->currentOccupant) {
                return response()->json([
                    'message' => 'Cannot create bill. The house is vacant and no residence_id was provided.'
                ], 400);
            }
            $validated['residence_id'] = $house->currentOccupant->residence_id;
        }

        // Auto-detect fee amount if not provided
        if (empty($validated['amount'])) {
            $feeType = FeeType::find($validated['fee_type_id']);
            $validated['amount'] = $feeType ? $feeType->amount : 0.00;
        }

        $validated['status'] = $validated['status'] ?? 'unpaid';
        if ($validated['status'] === 'paid') {
            $validated['payment_date'] = Carbon::now();
        }

        $payment = Payment::create($validated);

        return response()->json([
            'message' => 'Bill/payment record created successfully.',
            'data' => $payment->load(['house', 'residence', 'feeType'])
        ], 201);
    }

    /**
     * Mark a payment/bill as paid.
     */
    public function pay(string $id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment record not found.'], 404);
        }

        if ($payment->status === 'paid') {
            return response()->json(['message' => 'This bill has already been paid.'], 400);
        }

        $payment->update([
            'status' => 'paid',
            'payment_date' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully.',
            'data' => $payment->load(['house', 'residence', 'feeType'])
        ]);
    }

    /**
     * Generate monthly bills for all occupied houses for a specific month and year.
     * Rules:
     * - Occupied houses (either permanent or contract residents) are billed.
     * - Vacant houses are not billed.
     * - Dues are created dynamically from all active fee types in the database.
     */
    public function generateMonthlyBills(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
        ]);

        $month = (int)$validated['month'];
        $year = (int)$validated['year'];

        $startOfTargetMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfTargetMonth = Carbon::create($year, $month, 1)->endOfMonth();

        $houses = House::all();
        $feeTypes = FeeType::all();
        $billsCreated = 0;
        $createdBillsList = [];

        foreach ($houses as $house) {
            // Find if there is an active resident in this house during this month/year
            $occupancy = HouseResidentHistory::where('house_id', $house->id)
                ->where('start_date', '<=', $endOfTargetMonth->toDateString())
                ->where(function ($q) use ($startOfTargetMonth) {
                    $q->whereNull('end_date')
                      ->orWhere('end_date', '>=', $startOfTargetMonth->toDateString());
                })
                ->first();

            if ($occupancy) {
                $residenceId = $occupancy->residence_id;

                foreach ($feeTypes as $feeType) {
                    // Generate bill for each fee type in the database
                    $bill = Payment::firstOrCreate([
                        'house_id' => $house->id,
                        'residence_id' => $residenceId,
                        'month' => $month,
                        'year' => $year,
                        'fee_type_id' => $feeType->id,
                    ], [
                        'amount' => $feeType->amount,
                        'status' => 'unpaid'
                    ]);

                    if ($bill->wasRecentlyCreated) {
                        $billsCreated++;
                        $createdBillsList[] = $bill->load(['house', 'residence', 'feeType']);
                    }
                }
            }
        }

        return response()->json([
            'message' => "Successfully generated {$billsCreated} bills for {$month}-{$year}.",
            'bills_created' => $billsCreated,
            'data' => $createdBillsList
        ]);
    }

    /**
     * Record bulk payments (e.g. paying dues in advance for 12 months).
     */
    public function payBulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'house_id' => 'required|uuid|exists:house,id',
            'residence_id' => 'required|uuid|exists:residence,id',
            'fee_type_id' => 'required|uuid|exists:fee_type,id',
            'start_month' => 'required|integer|min:1|max:12',
            'start_year' => 'required|integer|min:2000',
            'number_of_months' => 'required|integer|min:1|max:60',
        ]);

        $houseId = $validated['house_id'];
        $residenceId = $validated['residence_id'];
        $feeTypeId = $validated['fee_type_id'];
        $startMonth = (int)$validated['start_month'];
        $startYear = (int)$validated['start_year'];
        $numberOfMonths = (int)$validated['number_of_months'];

        // Get rate dynamically from the database
        $feeType = FeeType::find($feeTypeId);
        $monthlyRate = $feeType->amount;

        $paymentsList = [];
        $currentMonth = $startMonth;
        $currentYear = $startYear;

        for ($i = 0; $i < $numberOfMonths; $i++) {
            // Find or create bill for this specific period
            $payment = Payment::updateOrCreate([
                'house_id' => $houseId,
                'residence_id' => $residenceId,
                'month' => $currentMonth,
                'year' => $currentYear,
                'fee_type_id' => $feeTypeId,
            ], [
                'amount' => $monthlyRate,
                'status' => 'paid',
                'payment_date' => Carbon::now()
            ]);

            $paymentsList[] = $payment;

            // Increment month
            $currentMonth++;
            if ($currentMonth > 12) {
                $currentMonth = 1;
                $currentYear++;
            }
        }

        return response()->json([
            'message' => "Recorded bulk payments for {$numberOfMonths} months successfully.",
            'count' => count($paymentsList),
            'data' => $paymentsList
        ]);
    }
}
