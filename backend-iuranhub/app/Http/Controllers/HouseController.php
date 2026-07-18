<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\Residence;
use App\Models\HouseResidentHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class HouseController extends Controller
{
    /**
     * Display a listing of houses.
     */
    public function index(Request $request): JsonResponse
    {
        $houses = House::with(['currentOccupant.residence'])->paginate($request->query('per_page', 10));

        return response()->json([
            'message' => 'Houses retrieved successfully.',
            'data' => $houses
        ]);
    }

    /**
     * Store a newly created house in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'house_number' => 'required|string|unique:house,house_number',
            'status' => 'nullable|string|in:vacant,occupied',
        ]);

        $validated['status'] = $validated['status'] ?? 'vacant';

        $house = House::create($validated);

        return response()->json([
            'message' => 'House created successfully.',
            'data' => $house
        ], 201);
    }

    /**
     * Display the specified house, including history and payments.
     */
    public function show(string $id): JsonResponse
    {
        $house = House::with([
            'histories.residence',
            'payments.residence',
            'currentOccupant.residence'
        ])->find($id);

        if (!$house) {
            return response()->json(['message' => 'House not found.'], 404);
        }

        return response()->json([
            'message' => 'House details retrieved successfully.',
            'data' => $house
        ]);
    }

    /**
     * Update the specified house in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $house = House::find($id);

        if (!$house) {
            return response()->json(['message' => 'House not found.'], 404);
        }

        $validated = $request->validate([
            'house_number' => 'required|string|unique:house,house_number,' . $id,
            'status' => 'nullable|string|in:vacant,occupied',
        ]);

        $house->update($validated);

        return response()->json([
            'message' => 'House updated successfully.',
            'data' => $house
        ]);
    }

    /**
     * Assign a resident to the house.
     */
    public function assignResident(Request $request, string $id): JsonResponse
    {
        $house = House::find($id);

        if (!$house) {
            return response()->json(['message' => 'House not found.'], 404);
        }

        $validated = $request->validate([
            'residence_id' => 'required|uuid|exists:residence,id',
            'start_date' => 'nullable|date',
        ]);

        $residenceId = $validated['residence_id'];
        $startDate = $validated['start_date'] ?? Carbon::today()->toDateString();

        // 1. Close any active residency record for this house
        HouseResidentHistory::where('house_id', $house->id)
            ->whereNull('end_date')
            ->update([
                'end_date' => Carbon::parse($startDate)->subDay()->toDateString()
            ]);

        // 2. Close any active residency record for this resident in other houses
        HouseResidentHistory::where('residence_id', $residenceId)
            ->whereNull('end_date')
            ->update([
                'end_date' => Carbon::parse($startDate)->subDay()->toDateString()
            ]);

        // 3. Create new history record
        $history = HouseResidentHistory::create([
            'house_id' => $house->id,
            'residence_id' => $residenceId,
            'start_date' => $startDate,
            'end_date' => null
        ]);

        // 4. Update house status
        $house->update(['status' => 'occupied']);

        return response()->json([
            'message' => 'Resident successfully assigned to house.',
            'data' => $history->load(['house', 'residence'])
        ]);
    }

    /**
     * Remove the current resident from the house.
     */
    public function removeResident(Request $request, string $id): JsonResponse
    {
        $house = House::find($id);

        if (!$house) {
            return response()->json(['message' => 'House not found.'], 404);
        }

        $validated = $request->validate([
            'end_date' => 'nullable|date',
        ]);

        $endDate = $validated['end_date'] ?? Carbon::today()->toDateString();

        // Find active residency
        $activeHistory = HouseResidentHistory::where('house_id', $house->id)
            ->whereNull('end_date')
            ->first();

        if (!$activeHistory) {
            return response()->json(['message' => 'No active resident in this house.'], 400);
        }

        // Close residency
        $activeHistory->update([
            'end_date' => $endDate
        ]);

        // Set house status to vacant
        $house->update(['status' => 'vacant']);

        return response()->json([
            'message' => 'Resident successfully removed from house.',
            'data' => $activeHistory
        ]);
    }

    /**
     * Remove the specified house from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $house = House::find($id);

        if (!$house) {
            return response()->json(['message' => 'House not found.'], 404);
        }

        $house->delete();

        return response()->json([
            'message' => 'House deleted successfully.'
        ]);
    }
}
