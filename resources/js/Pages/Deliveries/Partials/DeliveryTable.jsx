import { useState, Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import {
    FaTruck, FaUser, FaMapMarkerAlt, FaBox, FaCalendarAlt, FaStickyNote,
    FaMoneyBillWave, FaCheck, FaTrash, FaBan, FaExclamationTriangle, FaEllipsisV, FaEye
} from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa6';

export default function DeliveryTable({
    deliveries,
    drivers,
    onView,
    onAssignDriver,
    onPickup,
    onDeliver,
    onFail,
    onCancel,
    onDelete
}) {
    const [selectedDriver, setSelectedDriver] = useState({});

    const handleAssign = (delivery) => {
        const driverId = selectedDriver[delivery.id];
        if (driverId) onAssignDriver(delivery, driverId);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            case 'assigned': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'shipping': return 'bg-purple-50 text-purple-700 border border-purple-200';
            case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
            case 'failed': return 'bg-red-50 text-red-700 border border-red-200';
            case 'cancelled': return 'bg-gray-100 text-gray-600 border border-gray-300';
            default: return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const getStatusText = (status) => {
        const map = {
            'pending': 'Menunggu Driver',
            'assigned': 'Driver Siap',
            'shipping': 'Sedang Jalan',
            'delivered': 'Selesai',
            'failed': 'Gagal Kirim',
            'cancelled': 'Dibatalkan'
        };
        return map[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    // --- EMPTY STATE ---
    if (!deliveries.data || deliveries.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <FaBoxOpen className="text-4xl text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tidak ada data pengiriman</h3>
                <p className="text-gray-500 mt-1 text-sm max-w-sm">
                    Coba ubah kata kunci pencarian atau filter Anda.
                </p>
            </div>
        );
    }

    return (
        // HAPUS overflow-hidden disini agar dropdown bisa keluar (jika perlu), 
        // TAPI biasanya tabel butuh overflow-x-auto.
        // Solusi HeadlessUI Menu biasanya menggunakan Portal atau Fixed positioning otomatis.
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

            {/* Container Table: overflow-x-auto agar responsif */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID & Waktu</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Penerima & Alamat</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Info Order</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {deliveries.data.map((delivery) => (
                            <tr key={delivery.id} className="hover:bg-blue-50/30 transition-colors group">

                                {/* 1. ID & Waktu */}
                                <td className="px-6 py-4 whitespace-nowrap align-top">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                                            <FaTruck />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-gray-900">{delivery.do_code}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <FaCalendarAlt size={10} />
                                                {formatDate(delivery.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* 2. Penerima */}
                                <td className="px-6 py-4 align-top">
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <FaUser className="text-gray-400 text-xs" />
                                        {delivery.customer_name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-start gap-1.5 max-w-[200px]" title={delivery.shipping_address}>
                                        <FaMapMarkerAlt className="text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                                        <span className="truncate">{delivery.shipping_address}</span>
                                    </div>
                                    {delivery.order?.notes && (
                                        <div className="text-[10px] text-orange-600 mt-1 flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded w-fit">
                                            <FaStickyNote /> {delivery.order.notes}
                                        </div>
                                    )}
                                </td>

                                {/* 3. Driver */}
                                <td className="px-6 py-4 whitespace-nowrap align-top">
                                    {delivery.driver ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-green-200">
                                                {delivery.driver.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{delivery.driver.name}</p>
                                                <p className="text-xs text-gray-500">{delivery.driver.phone || '-'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        delivery.status === 'pending' ? (
                                            <div className="flex gap-2 items-center">
                                                <select
                                                    className="text-xs border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 pl-2 pr-6 w-32"
                                                    value={selectedDriver[delivery.id] || ''}
                                                    onChange={(e) => setSelectedDriver({ ...selectedDriver, [delivery.id]: e.target.value })}
                                                >
                                                    <option value="">Pilih Driver...</option>
                                                    {drivers.map(d => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleAssign(delivery)}
                                                    className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={!selectedDriver[delivery.id]}
                                                    title="Simpan Driver"
                                                >
                                                    <FaCheck size={10} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Tidak ada driver</span>
                                        )
                                    )}
                                </td>

                                {/* 4. Info Order */}
                                <td className="px-6 py-4 whitespace-nowrap align-top">
                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                        <FaBox className="text-gray-400" size={10} />
                                        Ref: {delivery.order?.order_code}
                                    </div>
                                    <div className="mt-1">
                                        {delivery.order?.payment_status === 'paid'
                                            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                <FaMoneyBillWave /> Lunas
                                            </span>
                                            : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                                <FaMoneyBillWave /> Belum Lunas
                                            </span>
                                        }
                                    </div>
                                </td>

                                {/* 5. Status */}
                                <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(delivery.status)}`}>
                                        {getStatusText(delivery.status)}
                                    </span>
                                    {(delivery.status === 'failed' || delivery.status === 'cancelled') && delivery.driver_notes && (
                                        <div className="mt-1 max-w-[120px] mx-auto text-center">
                                            <p className="text-[10px] text-red-500 italic truncate" title={delivery.driver_notes}>
                                                "{delivery.driver_notes}"
                                            </p>
                                        </div>
                                    )}
                                    {delivery.shipped_at && (
                                        <p className="text-[10px] text-gray-400 mt-1 italic">
                                            {delivery.status === 'delivered' ? 'Selesai' : 'Jalan'}: {formatDate(delivery.shipped_at).split(' ')[1]}
                                        </p>
                                    )}
                                </td>

                                {/* 6. Aksi (Dropdown Menu) */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-500 bg-white rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 shadow-sm border border-gray-200">
                                                <FaEllipsisV />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            {/* Menggunakan z-50 dan right-0 agar muncul di atas tabel */}
                                            <Menu.Items className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => onView(delivery)}
                                                                className={`${active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                            >
                                                                <FaEye className="mr-2" /> Detail
                                                            </button>
                                                        )}
                                                    </Menu.Item>

                                                    {delivery.status === 'assigned' && (
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => onPickup(delivery)}
                                                                    className={`${active ? 'bg-purple-50 text-purple-600' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                                >
                                                                    <FaTruck className="mr-2" /> Mulai Jalan
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    )}

                                                    {delivery.status === 'shipping' && (
                                                        <>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => onDeliver(delivery)}
                                                                        className={`${active ? 'bg-green-50 text-green-600' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                                    >
                                                                        <FaCheck className="mr-2" /> Selesai
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => onFail(delivery)}
                                                                        className={`${active ? 'bg-orange-50 text-orange-600' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                                    >
                                                                        <FaExclamationTriangle className="mr-2" /> Laporkan Gagal
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </>
                                                    )}

                                                    {['pending', 'assigned'].includes(delivery.status) && (
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => onCancel(delivery)}
                                                                    className={`${active ? 'bg-red-50 text-red-600' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                                >
                                                                    <FaBan className="mr-2" /> Batalkan
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    )}
                                                </div>

                                                {['cancelled', 'failed'].includes(delivery.status) && (
                                                    <div className="px-1 py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => onDelete(delivery)}
                                                                    className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'} group flex rounded-md items-center w-full px-2 py-2 text-sm font-bold`}
                                                                >
                                                                    <FaTrash className="mr-2" /> Hapus Data
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                )}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINATION --- */}
            {deliveries.links && deliveries.links.length > 3 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-500 hidden sm:block">
                        Menampilkan <span className="font-bold">{deliveries.from}</span> sampai <span className="font-bold">{deliveries.to}</span> dari <span className="font-bold">{deliveries.total}</span> data
                    </div>
                    <div className="flex gap-1">
                        {deliveries.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : !link.url
                                        ? 'text-gray-400 cursor-not-allowed bg-transparent'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}