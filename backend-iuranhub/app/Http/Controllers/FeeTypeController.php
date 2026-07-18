<?php

namespace App\Http\Controllers;

use App\Models\FeeType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FeeTypeController extends Controller
{
    /**
     * Display a listing of fee types.
     */
    public function index(Request $request): JsonResponse
    {
        $feeTypes = FeeType::orderBy('name', 'asc')
            ->paginate($request->query('per_page', 10));

        return response()->json([
            'message' => 'Fee types retrieved successfully.',
            'data' => $feeTypes
        ]);
    }

    /**
     * Store a newly created fee type in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fee_type,name',
            'amount' => 'required|numeric|min:0',
        ]);

        $feeType = FeeType::create($validated);

        return response()->json([
            'message' => 'Fee type created successfully.',
            'data' => $feeType
        ], 201);
    }

    /**
     * Display the specified fee type.
     */
    public function show(string $id): JsonResponse
    {
        $feeType = FeeType::find($id);

        if (!$feeType) {
            return response()->json(['message' => 'Fee type not found.'], 404);
        }

        return response()->json([
            'message' => 'Fee type details retrieved successfully.',
            'data' => $feeType
        ]);
    }

    /**
     * Update the specified fee type in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $feeType = FeeType::find($id);

        if (!$feeType) {
            return response()->json(['message' => 'Fee type not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fee_type,name,' . $id,
            'amount' => 'required|numeric|min:0',
        ]);

        $feeType->update($validated);

        return response()->json([
            'message' => 'Fee type updated successfully.',
            'data' => $feeType
        ]);
    }

    /**
     * Remove the specified fee type from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $feeType = FeeType::find($id);

        if (!$feeType) {
            return response()->json(['message' => 'Fee type not found.'], 404);
        }

        $feeType->delete();

        return response()->json([
            'message' => 'Fee type deleted successfully.'
        ]);
    }
}
