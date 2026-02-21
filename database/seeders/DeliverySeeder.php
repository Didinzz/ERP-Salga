<?php
// database/seeders/DeliverySeeder.php

namespace Database\Seeders;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DeliverySeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan ada orders dan users terlebih dahulu
        $orders = Order::where('status', 'confirmed')->get();
        $users = User::all();

        if ($orders->isEmpty()) {
            $this->command->info('Tidak ada orders dengan status confirmed. Skipping delivery seeder.');
            return;
        }

        if ($users->isEmpty()) {
            $this->command->info('Tidak ada users. Skipping delivery seeder.');
            return;
        }

        $deliveryStatuses = ['pending', 'assigned', 'on_delivery', 'delivered', 'cancelled', 'failed'];
        $deliveryNotes = [
            'Tolong dikirim sebelum jam 5 sore',
            'Penerima sedang tidak di rumah, titip ke tetangga',
            'Packing yang rapi',
            'Hati-hati barang mudah pecah',
            'Tidak ada catatan khusus',
            'Tolong hubungi sebelum datang',
        ];

        $deliveryFailNotes = [
            'Penerima tidak bisa dihubungi',
            'Alamat tidak ditemukan',
            'Penerima menolak paket',
            'Kendala teknis kendaraan',
            'Cuaca buruk',
            'Penerima pindah alamat',
        ];

        $deliverySuccessNotes = [
            'Paket diterima dengan baik',
            'Penerima sangat puas',
            'Tidak ada kendala',
            'Pengiriman tepat waktu',
            'Penerima berterima kasih',
        ];

        $deliveryCount = 0;

        foreach ($orders as $order) {
            // Skip jika order sudah memiliki delivery
            if ($order->delivery()->exists()) {
                continue;
            }

            // Random status dengan probabilitas berbeda
            $statusWeights = [
                'pending' => 10,
                'assigned' => 15,
                'on_delivery' => 20,
                'delivered' => 40,
                'cancelled' => 10,
                'failed' => 5,
            ];

            $status = $this->getWeightedRandomStatus($statusWeights);

            // Tentukan driver berdasarkan status
            $driverId = null;
            $assignedAt = null;
            $pickedUpAt = null;
            $deliveredAt = null;
            $deliveryNotesText = null;
            $proofImage = null;

            if (in_array($status, ['assigned', 'on_delivery', 'delivered'])) {
                $driverId = $users->random()->id;
                $assignedAt = Carbon::now()->subDays(rand(1, 5));

                if (in_array($status, ['on_delivery', 'delivered'])) {
                    $pickedUpAt = $assignedAt->copy()->addHours(rand(1, 3));

                    if ($status === 'delivered') {
                        $deliveredAt = $pickedUpAt->copy()->addHours(rand(1, 6));
                        $deliveryNotesText = $deliverySuccessNotes[array_rand($deliverySuccessNotes)];
                        $proofImage = 'delivery_proof_' . rand(1, 5) . '.jpg';
                        
                        // Update order status to completed
                        $order->update([
                            'status' => 'completed',
                            'completed_date' => $deliveredAt,
                        ]);
                    }
                }
            }

            if ($status === 'failed') {
                $deliveryNotesText = $deliveryFailNotes[array_rand($deliveryFailNotes)];
            }

            // Buat delivery
            Delivery::create([
                'order_id' => $order->id,
                'driver_id' => $driverId,
                'recipient_name' => $order->customer_name,
                'recipient_phone' => $order->customer_phone,
                'delivery_address' => $order->customer_address,
                'delivery_cost' => rand(10000, 50000),
                'status' => $status,
                'notes' => $deliveryNotes[array_rand($deliveryNotes)],
                'scheduled_date' => Carbon::now()->addDays(rand(1, 7)),
                'assigned_at' => $assignedAt,
                'picked_up_at' => $pickedUpAt,
                'delivered_at' => $deliveredAt,
                'delivery_notes' => $deliveryNotesText,
                'proof_image' => $proofImage,
                'created_at' => Carbon::now()->subDays(rand(1, 10)),
                'updated_at' => Carbon::now()->subDays(rand(0, 5)),
            ]);

            $deliveryCount++;

            // Update order status berdasarkan delivery status
            if (in_array($status, ['assigned', 'on_delivery', 'delivered'])) {
                $order->update(['status' => 'processing']);
            }
        }

        $this->command->info("Berhasil membuat {$deliveryCount} sample deliveries!");
    }

    private function getWeightedRandomStatus($weights)
    {
        $total = array_sum($weights);
        $random = rand(1, $total);
        
        $current = 0;
        foreach ($weights as $status => $weight) {
            $current += $weight;
            if ($random <= $current) {
                return $status;
            }
        }
        
        return 'pending'; // fallback
    }
}