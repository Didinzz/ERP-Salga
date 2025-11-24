<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data Pelanggan Dummy dengan Koordinat Real
        $customers = [
            [
                'name' => 'Toko Sembako Limboto Indah',
                'owner_name' => 'Haji Ahmad',
                'phone' => '0812-3456-7890',
                'address' => 'Jl. Reformasi, Limboto (Dekat Menara)',
                'latitude' => 0.6231228823327661,
                'longitude' => 123.0092205822319,
                'status' => 'active',
            ],
            [
                'name' => 'Warung Makan Telaga Biru',
                'owner_name' => 'Ibu Marni',
                'phone' => '0821-9988-7766',
                'address' => 'Jl. Jenderal Sudirman, Telaga',
                'latitude' => 0.6018189865866391,
                'longitude' => 123.04052124431877,
                'status' => 'active',
            ],
            [
                'name' => 'Agen Air Minum Kota Utara',
                'owner_name' => 'Pak Budi Santoso',
                'phone' => '0853-1122-3344',
                'address' => 'Jl. Bengawan Solo, Kota Gorontalo',
                'latitude' => 0.5919040635619842,
                'longitude' => 123.04931846021772,
                'status' => 'active',
            ],
            [
                'name' => 'Depot Salga Cabang Taruna',
                'owner_name' => 'Ko Hendra',
                'phone' => '0811-4321-8765',
                'address' => 'Jl. Taruna Remaja, Kota Gorontalo',
                'latitude' => 0.5933214940468976,
                'longitude' => 123.0570957090557,
                'status' => 'active',
            ],
        ];

        foreach ($customers as $data) {
            Customer::create($data);
        }
    }
}