<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class House extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'house';

    protected $fillable = [
        'house_number',
        'status',
    ];

    protected $appends = [
        'current_resident',
    ];

    /**
     * Get the current active resident details directly.
     */
    public function getCurrentResidentAttribute()
    {
        return $this->currentOccupant ? $this->currentOccupant->residence : null;
    }

    /**
     * Get all residency history for this house.
     */
    public function histories(): HasMany
    {
        return $this->hasMany(HouseResidentHistory::class, 'house_id');
    }

    /**
     * Get all payments associated with this house.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'house_id');
    }

    /**
     * Get the current active occupant history record.
     */
    public function currentOccupant(): HasOne
    {
        return $this->hasOne(HouseResidentHistory::class, 'house_id')
            ->whereNull('end_date');
    }
}
