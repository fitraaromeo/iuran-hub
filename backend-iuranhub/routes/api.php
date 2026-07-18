<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\ResidenceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FeeTypeController;

// Houses Routing
Route::apiResource('houses', HouseController::class);
Route::post('houses/{id}/assign-resident', [HouseController::class, 'assignResident']);
Route::post('houses/{id}/remove-resident', [HouseController::class, 'removeResident']);

// Residents Routing
Route::apiResource('residences', ResidenceController::class);

// Expenses Routing
Route::apiResource('expenses', ExpenseController::class);

// Fee Types Routing
Route::apiResource('fee-types', FeeTypeController::class);

// Payments Routing
Route::post('payments/generate-monthly-bills', [PaymentController::class, 'generateMonthlyBills']);
Route::post('payments/pay-bulk', [PaymentController::class, 'payBulk']);
Route::apiResource('payments', PaymentController::class)->only(['index', 'store', 'destroy']);
Route::post('payments/{id}/pay', [PaymentController::class, 'pay']);

// Reports Routing
Route::get('reports/summary', [ReportController::class, 'summary']);
Route::get('reports/monthly-detail', [ReportController::class, 'monthlyDetail']);
