<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\House;
use App\Models\Residence;
use App\Models\HouseResidentHistory;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\FeeType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a default User for API access testing if needed
        User::factory()->create([
            'name' => 'Pak RT',
            'email' => 'rt@example.com',
            'password' => bcrypt('password'),
        ]);

        // Clean up previous data to avoid duplicate key issues during seed
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        House::truncate();
        Residence::truncate();
        HouseResidentHistory::truncate();
        Payment::truncate();
        Expense::truncate();
        FeeType::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Create dynamic Fee Types
        $securityFee = FeeType::create([
            'name' => 'Satpam',
            'amount' => 100000.00,
        ]);

        $cleanlinessFee = FeeType::create([
            'name' => 'Kebersihan',
            'amount' => 15000.00,
        ]);

        // 3. Create 20 Houses
        $houses = [];
        for ($i = 1; $i <= 20; $i++) {
            $numStr = str_pad($i, 2, '0', STR_PAD_LEFT);
            $houses[] = House::create([
                'house_number' => "Block A-{$numStr}",
                'status' => 'vacant',
            ]);
        }

        // 4. Create 15 Permanent Residents and Assign them to Houses 1 to 15
        $firstNames = ['Ahmad', 'Budi', 'Chandra', 'Dedi', 'Eko', 'Fajar', 'Gunawan', 'Hendra', 'Indra', 'Joko', 'Kurniawan', 'Laksana', 'Mulyono', 'Nugroho', 'Prabowo'];
        $lastNames = ['Hartono', 'Susilo', 'Wijaya', 'Pratama', 'Santoso', 'Wibowo', 'Kusuma', 'Suryadi', 'Setiawan', 'Hidayat', 'Saputra', 'Budiman', 'Siregar', 'Lubis', 'Pohan'];

        for ($i = 0; $i < 15; $i++) {
            $fullName = $firstNames[$i] . ' ' . $lastNames[$i];
            $resident = Residence::create([
                'full_name' => $fullName,
                'identity_card_photo' => "ktp_resident_" . ($i + 1) . ".jpg",
                'status' => 'permanent',
                'phone_number' => '081234567' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'is_married' => ($i % 2 === 0),
            ]);

            // Assign history from Jan 1st 2026 onwards
            HouseResidentHistory::create([
                'house_id' => $houses[$i]->id,
                'residence_id' => $resident->id,
                'start_date' => '2026-01-01',
                'end_date' => null,
            ]);

            $houses[$i]->update(['status' => 'occupied']);
        }

        // 5. Create 2 Temporary/Contract Residents for Houses 16 and 17
        // Resident 16: Occupied from Jan 1st 2026 to Jun 30th 2026 (moved out)
        $contractor1 = Residence::create([
            'full_name' => 'Ferry Siregar',
            'identity_card_photo' => 'ktp_ferry.jpg',
            'status' => 'contract',
            'phone_number' => '081399998881',
            'is_married' => true,
        ]);
        HouseResidentHistory::create([
            'house_id' => $houses[15]->id, // House 16
            'residence_id' => $contractor1->id,
            'start_date' => '2026-01-01',
            'end_date' => '2026-06-30',
        ]);

        // Resident 17: Occupying from Jul 1st 2026 onwards (currently active)
        $contractor2 = Residence::create([
            'full_name' => 'Gita Permata',
            'identity_card_photo' => 'ktp_gita.jpg',
            'status' => 'contract',
            'phone_number' => '081399998882',
            'is_married' => false,
        ]);
        HouseResidentHistory::create([
            'house_id' => $houses[16]->id, // House 17
            'residence_id' => $contractor2->id,
            'start_date' => '2026-07-01',
            'end_date' => null,
        ]);
        $houses[16]->update(['status' => 'occupied']);

        // House 18, 19, 20 are vacant (no resident history)

        // 6. Generate Bills automatically for Jan - Jul 2026 using our billing logic
        // We will seed the monthly bills for months 1 to 7
        for ($month = 1; $month <= 7; $month++) {
            $year = 2026;
            $startOfTargetMonth = Carbon::create($year, $month, 1)->startOfMonth();
            $endOfTargetMonth = Carbon::create($year, $month, 1)->endOfMonth();

            foreach ($houses as $house) {
                // Find occupant in that specific month
                $occupancy = HouseResidentHistory::where('house_id', $house->id)
                    ->where('start_date', '<=', $endOfTargetMonth->toDateString())
                    ->where(function ($q) use ($startOfTargetMonth) {
                        $q->whereNull('end_date')
                          ->orWhere('end_date', '>=', $startOfTargetMonth->toDateString());
                      })
                    ->first();

                if ($occupancy) {
                    $residenceId = $occupancy->residence_id;

                    // Generate Security Dues (100k)
                    Payment::create([
                        'house_id' => $house->id,
                        'residence_id' => $residenceId,
                        'month' => $month,
                        'year' => $year,
                        'fee_type_id' => $securityFee->id,
                        'amount' => 100000.00,
                        'status' => 'unpaid',
                        'payment_date' => null,
                    ]);

                    // Generate Cleanliness Dues (15k)
                    Payment::create([
                        'house_id' => $house->id,
                        'residence_id' => $residenceId,
                        'month' => $month,
                        'year' => $year,
                        'fee_type_id' => $cleanlinessFee->id,
                        'amount' => 15000.00,
                        'status' => 'unpaid',
                    ]);
                }
            }
        }

        // 7. Record Payments (Let's make Jan, Feb fully paid by all active residents)
        $paymentDate = Carbon::create(2026, 1, 15, 10, 0, 0);
        Payment::where('month', 1)->update([
            'status' => 'paid',
            'payment_date' => $paymentDate,
        ]);

        $paymentDate = Carbon::create(2026, 2, 14, 11, 0, 0);
        Payment::where('month', 2)->update([
            'status' => 'paid',
            'payment_date' => $paymentDate,
        ]);

        // For March: Let 5 permanent residents pay cleanliness fees for 1 year (12 months = 180k)
        // Residents of houses 1 to 5 prepay
        for ($i = 0; $i < 5; $i++) {
            $houseId = $houses[$i]->id;
            $residenceId = HouseResidentHistory::where('house_id', $houseId)->first()->residence_id;

            // Delete cleanliness bills for March through July to overwrite with paid bulk records
            Payment::where('house_id', $houseId)
                ->where('fee_type_id', $cleanlinessFee->id)
                ->whereIn('month', [3, 4, 5, 6, 7])
                ->delete();

            // Insert 12 months cleanliness payments
            $payTime = Carbon::create(2026, 3, 5, 9, 30, 0);
            for ($m = 1; $m <= 12; $m++) {
                Payment::create([
                    'house_id' => $houseId,
                    'residence_id' => $residenceId,
                    'month' => $m,
                    'year' => 2026,
                    'fee_type_id' => $cleanlinessFee->id,
                    'amount' => 15000.00,
                    'status' => 'paid',
                    'payment_date' => $payTime,
                ]);
            }
        }

        // For other residents in March - July, pay monthly:
        // Mark security paid for March, April, May, June for houses 1 to 15
        for ($month = 3; $month <= 6; $month++) {
            $payTime = Carbon::create(2026, $month, 10, 14, 0, 0);
            Payment::where('month', $month)
                ->where('fee_type_id', $securityFee->id)
                ->whereIn('house_id', array_column(array_slice($houses, 0, 15), 'id'))
                ->update([
                    'status' => 'paid',
                    'payment_date' => $payTime,
                ]);

            // Cleanliness paid for houses 6 to 15
            Payment::where('month', $month)
                ->where('fee_type_id', $cleanlinessFee->id)
                ->whereIn('house_id', array_column(array_slice($houses, 5, 10), 'id'))
                ->update([
                    'status' => 'paid',
                    'payment_date' => $payTime,
                ]);
        }

        // 8. Seed RT Monthly Expenses (January - July 2026)
        for ($month = 1; $month <= 7; $month++) {
            $expenseDate = Carbon::create(2026, $month, 28);
            // Recurring Expense: Gaji Satpam (5,000,000)
            Expense::create([
                'amount' => 5000000.00,
                'description' => "Gaji Satpam Bulan " . $expenseDate->format('F'),
                'category' => 'salary',
                'date' => $expenseDate->toDateString(),
            ]);

            // Recurring Expense: Listrik Pos Satpam (200,000)
            Expense::create([
                'amount' => 200000.00,
                'description' => "Token Listrik Pos Satpam Bulan " . $expenseDate->format('F'),
                'category' => 'electricity',
                'date' => $expenseDate->toDateString(),
            ]);
        }

        // Ad-hoc Expenses
        // March: Gutter repair (1,500,000)
        Expense::create([
            'amount' => 1500000.00,
            'description' => 'Perbaikan selokan blok A-04 s/d A-08',
            'category' => 'maintenance',
            'date' => '2026-03-12',
        ]);

        // June: Road repair (4,000,000)
        Expense::create([
            'amount' => 4000000.00,
            'description' => 'Tambal aspal jalan utama perumahan',
            'category' => 'maintenance',
            'date' => '2026-06-18',
        ]);
    }
}
