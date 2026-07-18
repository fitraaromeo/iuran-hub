<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'payment';

    protected $fillable = [
        'house_id',
        'residence_id',
        'fee_type_id',
        'amount',
        'month',
        'year',
        'status',
        'payment_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'month' => 'integer',
        'year' => 'integer',
        'payment_date' => 'datetime',
    ];

    /**
     * Get the house associated with this payment.
     */
    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class, 'house_id');
    }

    /**
     * Get the resident who paid.
     */
    public function residence(): BelongsTo
    {
        return $this->belongsTo(Residence::class, 'residence_id');
    }

    /**
     * Get the fee type associated with this payment.
     */
    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class, 'fee_type_id');
    }
}
