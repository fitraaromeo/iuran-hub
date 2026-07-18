<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseResidentHistory extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'house_resident_history';

    protected $fillable = [
        'house_id',
        'residence_id',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the house that this history record relates to.
     */
    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class, 'house_id');
    }

    /**
     * Get the resident this history record relates to.
     */
    public function residence(): BelongsTo
    {
        return $this->belongsTo(Residence::class, 'residence_id');
    }
}
