<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the expenses.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Expense::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year);
        }

        $expenses = $query->orderBy('date', 'desc')->paginate($request->query('per_page', 10));

        return response()->json([
            'message' => 'Expenses retrieved successfully.',
            'data' => $expenses
        ]);
    }

    /**
     * Store a newly created expense in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'category' => 'required|string|in:maintenance,salary,electricity,other',
            'date' => 'required|date',
        ]);

        $expense = Expense::create($validated);

        return response()->json([
            'message' => 'Expense recorded successfully.',
            'data' => $expense
        ], 201);
    }

    /**
     * Display the specified expense.
     */
    public function show(string $id): JsonResponse
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Expense not found.'], 404);
        }

        return response()->json([
            'message' => 'Expense details retrieved successfully.',
            'data' => $expense
        ]);
    }

    /**
     * Update the specified expense in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Expense not found.'], 404);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'category' => 'required|string|in:maintenance,salary,electricity,other',
            'date' => 'required|date',
        ]);

        $expense->update($validated);

        return response()->json([
            'message' => 'Expense updated successfully.',
            'data' => $expense
        ]);
    }

    /**
     * Remove the specified expense from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Expense not found.'], 404);
        }

        $expense->delete();

        return response()->json([
            'message' => 'Expense deleted successfully.'
        ]);
    }
}
