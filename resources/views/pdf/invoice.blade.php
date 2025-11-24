<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->order_code }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c5282;
        }
        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 8px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .table th {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-weight: bold;
        }
        .table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            margin-top: 20px;
            border-top: 2px solid #333;
            padding-top: 10px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .customer-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{ $company['name'] }}</div>
        <div>{{ $company['address'] }}</div>
        <div>Telp: {{ $company['phone'] }} | Email: {{ $company['email'] }}</div>
    </div>

    <div class="invoice-title">INVOICE</div>

    <div class="customer-info">
        <div>
            <div class="section">
                <div class="section-title">Informasi Pelanggan</div>
                <div><strong>{{ $order->customer_name }}</strong></div>
                <div>Telp: {{ $order->customer_phone ?: '-' }}</div>
                <div>Alamat: {{ $order->customer_address ?: '-' }}</div>
            </div>
        </div>
        <div>
            <div class="section">
                <div class="section-title">Informasi Transaksi</div>
                <div>No. Invoice: <strong>{{ $order->order_code }}</strong></div>
                <div>Tanggal: {{ $order->order_date->format('d/m/Y H:i') }}</div>
                <div>Kasir: {{ $order->user->name }}</div>
                <div>Metode Bayar: {{ strtoupper($order->payment_method) }}</div>
                <div>Status: 
                    <strong>
                        @if($order->payment_status === 'paid')
                            LUNAS
                        @elseif($order->payment_status === 'partial')
                            SEBAGIAN
                        @else
                            BELUM BAYAR
                        @endif
                    </strong>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Detail Produk</div>
        <table class="table">
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="45%">Nama Produk</th>
                    <th width="10%" class="text-center">Qty</th>
                    <th width="20%" class="text-right">Harga Satuan</th>
                    <th width="20%" class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->product->name }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="total-section">
        <table style="width: 300px; margin-left: auto;">
            <tr>
                <td><strong>Total Tagihan:</strong></td>
                <td class="text-right"><strong>Rp {{ number_format($order->total_amount, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td>Dibayar:</td>
                <td class="text-right">Rp {{ number_format($order->paid_amount, 0, ',', '.') }}</td>
            </tr>
            @if($order->payment_status === 'partial')
            <tr>
                <td><strong>Kekurangan:</strong></td>
                <td class="text-right"><strong>Rp {{ number_format($order->total_amount - $order->paid_amount, 0, ',', '.') }}</strong></td>
            </tr>
            @endif
        </table>
    </div>

    @if($order->notes)
    <div class="section">
        <div class="section-title">Catatan</div>
        <div>{{ $order->notes }}</div>
    </div>
    @endif

    <div class="footer">
        Terima kasih atas kunjungan Anda<br>
        Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan
    </div>
</body>
</html>