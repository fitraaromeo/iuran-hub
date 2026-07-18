<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Residence extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'residence';

    protected $fillable = [
        'full_name',
        'identity_card_photo',
        'status',
        'phone_number',
        'is_married',
    ];

    protected $casts = [
        'is_married' => 'boolean',
    ];

    /**
     * Get residency history records for this resident.
     */
    public function histories(): HasMany
    {
        return $this->hasMany(HouseResidentHistory::class, 'residence_id');
    }

    /**
     * Get all payment history for this resident.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'residence_id');
    }

    /**
     * Get the current active residency record.
     */
    public function currentHouse(): HasOne
    {
        return $this->hasOne(HouseResidentHistory::class, 'residence_id')
            ->whereNull('end_date');
    }
}
