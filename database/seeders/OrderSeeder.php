<?php
// database/seeders/OrderSeeder.php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MineralWaterProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        $products = MineralWaterProduct::all();

        // Create some sample orders
        for ($i = 0; $i < 10; $i++) {
            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => 'Customer ' . ($i + 1),
                'customer_phone' => '0812345678' . $i,
                'customer_address' => 'Alamat customer ' . ($i + 1),
                'status' => $this->getRandomStatus(),
                'total_amount' => 0,
                'paid_amount' => 0,
                'payment_status' => 'pending',
                'order_date' => Carbon::now()->subDays(rand(1, 30)),
            ]);

            // Add 1-3 random items to each order
            $itemCount = rand(1, 3);
            $selectedProducts = $products->random($itemCount);

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 5);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $quantity,
                ]);
            }

            // Update order total
            $order->updateTotal();

            // Set paid amount for some orders
            if (in_array($order->status, ['completed', 'processing'])) {
                $order->update([
                    'paid_amount' => $order->total_amount,
                    'payment_status' => 'paid',
                ]);
            }
        }
    }

    private function getRandomStatus()
    {
        $statuses = ['pending', 'confirmed', 'processing', 'completed'];
        return $statuses[array_rand($statuses)];
    }
}