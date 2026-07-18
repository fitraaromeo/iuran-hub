<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    /**
     * Get a 1-year summary of income, expenses, and running cash balances.
     */
    public function summary(Request $request): JsonResponse
    {
        $year = $request->query('year', Carbon::now()->year);

        // 1. Calculate opening balance (carry-over cash balance before January 1 of the chosen year)
        $incomesBefore = Payment::where('status', 'paid')
            ->where('payment_date', '<', Carbon::create($year, 1, 1, 0, 0, 0))
            ->sum('amount');

        $expensesBefore = Expense::where('date', '<', Carbon::create($year, 1, 1)->toDateString())
            ->sum('amount');

        $runningBalance = (float)($incomesBefore - $expensesBefore);
        $initialCarryOver = $runningBalance;

        $monthsData = [];

        for ($m = 1; $m <= 12; $m++) {
            // Fetch paid income in this specific month & year (based on actual payment date)
            $income = Payment::where('status', 'paid')
                ->whereMonth('payment_date', $m)
                ->whereYear('payment_date', $year)
                ->sum('amount');

            // Fetch expenses in this specific month & year
            $expense = Expense::whereMonth('date', $m)
                ->whereYear('date', $year)
                ->sum('amount');

            $net = (float)($income - $expense);
            $runningBalance += $net;

            $monthsData[] = [
                'month' => $m,
                'month_name' => Carbon::create()->month($m)->translatedFormat('F'),
                'total_income' => (float)$income,
                'total_expense' => (float)$expense,
                'net_balance' => $net,
                'remaining_balance' => $runningBalance
            ];
        }

        return response()->json([
            'message' => "Financial summary for year {$year} retrieved successfully.",
            'data' => [
                'year' => (int)$year,
                'initial_carry_over' => $initialCarryOver,
                'final_balance' => $runningBalance,
                'monthly_breakdown' => $monthsData,
                'total_houses' => (int)\App\Models\House::count(),
                'occupied_houses' => (int)\App\Models\House::where('status', 'occupied')->count(),
                'total_residents' => (int)\App\Models\Residence::count(),
                'unpaid_payments_count' => (int)Payment::where('status', 'unpaid')->count(),
            ]
        ]);
    }

    /**
     * Get detailed line-by-line transactions (incomes and expenses) for a specific month and year.
     */
    public function monthlyDetail(Request $request): JsonResponse
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
        ]);

        $month = (int)$request->query('month');
        $year = (int)$request->query('year');

        // Start and end of the requested month
        $startOfMonth = Carbon::create($year, $month, 1, 0, 0, 0);
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        // 1. Calculate opening balance before this month starts
        $incomesBefore = Payment::where('status', 'paid')
            ->where('payment_date', '<', $startOfMonth)
            ->sum('amount');

        $expensesBefore = Expense::where('date', '<', $startOfMonth->toDateString())
            ->sum('amount');

        $openingBalance = (float)($incomesBefore - $expensesBefore);

        // 2. Fetch line items
        // Incomes: actual payments received in this month
        $incomesList = Payment::with(['house', 'residence', 'feeType'])
            ->where('status', 'paid')
            ->whereBetween('payment_date', [$startOfMonth, $endOfMonth])
            ->orderBy('payment_date', 'asc')
            ->get();

        // Expenses: actual expenses incurred in this month
        $expensesList = Expense::whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->orderBy('date', 'asc')
            ->get();

        $totalIncome = (float)$incomesList->sum('amount');
        $totalExpense = (float)$expensesList->sum('amount');
        $closingBalance = $openingBalance + $totalIncome - $totalExpense;

        return response()->json([
            'message' => "Detailed report for " . $startOfMonth->format('F Y') . " retrieved successfully.",
            'data' => [
                'month' => $month,
                'year' => $year,
                'opening_balance' => $openingBalance,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'closing_balance' => $closingBalance,
                'incomes' => $incomesList,
                'expenses' => $expensesList
            ]
        ]);
    }
}
