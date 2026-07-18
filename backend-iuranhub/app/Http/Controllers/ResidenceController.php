<?php

namespace App\Http\Controllers;

use App\Models\Residence;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ResidenceController extends Controller
{
    /**
     * Display a listing of residents.
     */
    public function index(Request $request): JsonResponse
    {
        $residences = Residence::with(['currentHouse.house'])->paginate($request->query('per_page', 10));

        return response()->json([
            'message' => 'Residents retrieved successfully.',
            'data' => $residences
        ]);
    }

    /**
     * Store a newly created resident in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'identity_card_photo' => 'nullable',
            'status' => 'required|string|in:contract,permanent',
            'phone_number' => 'required|string|max:20',
            'is_married' => 'required|boolean',
        ]);

        // Check if there is an uploaded file instead
        if ($request->hasFile('identity_card_photo')) {
            $path = $request->file('identity_card_photo')->store('ktp_photos', 'public');
            $validated['identity_card_photo'] = $path;
        }

        $residence = Residence::create($validated);

        return response()->json([
            'message' => 'Resident created successfully.',
            'data' => $residence
        ], 201);
    }

    /**
     * Display the specified resident details.
     */
    public function show(string $id): JsonResponse
    {
        $residence = Residence::with([
            'histories.house',
            'payments.house',
            'currentHouse.house'
        ])->find($id);

        if (!$residence) {
            return response()->json(['message' => 'Resident not found.'], 404);
        }

        return response()->json([
            'message' => 'Resident details retrieved successfully.',
            'data' => $residence
        ]);
    }

    /**
     * Update the specified resident in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $residence = Residence::find($id);

        if (!$residence) {
            return response()->json(['message' => 'Resident not found.'], 404);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'identity_card_photo' => 'nullable',
            'status' => 'required|string|in:contract,permanent',
            'phone_number' => 'required|string|max:20',
            'is_married' => 'required|boolean',
        ]);

        if ($request->hasFile('identity_card_photo')) {
            // Delete old photo if it exists
            if ($residence->identity_card_photo && Storage::disk('public')->exists($residence->identity_card_photo)) {
                Storage::disk('public')->delete($residence->identity_card_photo);
            }
            $path = $request->file('identity_card_photo')->store('ktp_photos', 'public');
            $validated['identity_card_photo'] = $path;
        }

        $residence->update($validated);

        return response()->json([
            'message' => 'Resident updated successfully.',
            'data' => $residence
        ]);
    }

    /**
     * Remove the specified resident from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $residence = Residence::find($id);

        if (!$residence) {
            return response()->json(['message' => 'Resident not found.'], 404);
        }

        $residence->delete();

        return response()->json([
            'message' => 'Resident deleted successfully.'
        ]);
    }
}
