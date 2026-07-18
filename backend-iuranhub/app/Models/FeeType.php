<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeType extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'fee_type';

    protected $fillable = [
        'name',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Get all payments that are associated with this fee type.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'fee_type_id');
    }
}
