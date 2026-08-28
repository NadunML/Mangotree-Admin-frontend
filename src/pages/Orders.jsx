import { useState, useEffect } from 'react';
import axios from 'axios';

// ── Strict logo-palette status map ────────────────────────────────────────
// Orange (mango) = active/in-progress  |  Lime (leaf) = success/done
// Gray = neutral/unknown               |  Red = cancelled/danger only
const STATUS_CONFIG = {
    'Pending':          { badge: 'bg-gray-100 text-gray-600 border-gray-200',       dot: 'bg-gray-400',    icon: '🕐' },
    'Processing':       { badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500',  icon: '⏳' },
    'Ready for Pickup': { badge: 'bg-amber-100 text-amber-700 border-amber-200',    dot: 'bg-amber-500',   icon: '🛍️' },
    'Completed':        { badge: 'bg-lime-100 text-lime-700 border-lime-200',       dot: 'bg-lime-500',    icon: '✅' },
    'Cancelled':        { badge: 'bg-red-100 text-red-700 border-red-200',          dot: 'bg-red-500',     icon: '❌' },
};

export default function Orders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (error) { console.error('Error fetching orders:', error); }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Function to update status
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            alert('Order status updated!');
            fetchOrders(); // Refresh the list to show new status
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const completedCount = orders.filter(o => o.status === 'Completed').length;

    return (
        <div className="space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Customer Orders</h1>
                    <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="self-start flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-full hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* ── Mini stat strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📦</div>
                    <div>
                        <p className="text-xl font-extrabold text-orange-500">{orders.length}</p>
                        <p className="text-xs text-gray-400">Total Orders</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✅</div>
                    <div>
                        <p className="text-xl font-extrabold text-lime-600">{completedCount}</p>
                        <p className="text-xs text-gray-400">Completed</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 col-span-2 sm:col-span-1">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💰</div>
                    <div>
                        <p className="text-xl font-extrabold text-amber-600">Rs. {totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Total Revenue</p>
                    </div>
                </div>
            </div>

            {/* ── Status summary pills ── */}
            {orders.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                        const count = orders.filter(o => (o.status || 'Pending') === status).length;
                        if (count === 0) return null;
                        return (
                            <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {status} <span className="font-extrabold opacity-70">({count})</span>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* ── Orders list ── */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">📦</div>
                        <p className="text-gray-700 font-bold text-base">No orders found yet</p>
                        <p className="text-gray-400 text-sm mt-1">Customer orders will appear here once placed.</p>
                    </div>
                ) : (
                    orders.map(order => {
                        const status = order.status || 'Pending';
                        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

                                {/* Card Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-gray-50">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-lg">🧾</span>
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-gray-900 text-base">
                                                Order #MT-{String(order.id).padStart(4, '0')}
                                            </p>
                                            
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                {order.created_at && (
                                                    <p className="text-xs text-gray-400">
                                                        Placed: {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                                
                                                {/* Prominent Pickup Time Badge */}
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold border border-orange-200 shadow-sm">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Pickup Time: {order.pickup_time || 'Not Set'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 ml-14 md:ml-0">
                                        {/* Payment method — gray/neutral */}
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                            💳 {order.payment_method}
                                        </span>
                                        {/* Status badge — logo palette */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                            {cfg.icon} {status}
                                        </span>
                                        {/* Total amount — orange accent */}
                                        <span className="text-lg font-extrabold text-orange-500">
                                            Rs. {Number(order.total_amount).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Items table */}
                                <div className="px-6 py-4">
                                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">Ordered Items</p>
                                    {order.items && order.items.length > 0 ? (
                                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 text-left">
                                                        <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Item</th>
                                                        <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Qty</th>
                                                        <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {order.items.map(item => (
                                                        <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                                                            <td className="px-4 py-3 font-semibold text-gray-800">{item.item_name}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                                                                    ×{item.quantity}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                                Rs. {(item.price * item.quantity).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm font-medium">No items recorded.</p>
                                    )}
                                </div>

                                {/* Footer: status update */}
                                <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        <p className="text-xs text-gray-500 font-semibold">Current Status: {status}</p>
                                    </div>
                                    <select
                                        value={status}
                                        onChange={e => handleStatusChange(order.id, e.target.value)}
                                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer hover:border-orange-300"
                                    >
                                        <option value="Pending">🕐 Pending</option>
                                        <option value="Processing">⏳ Processing</option>
                                        <option value="Ready for Pickup">🛍️ Ready for Pickup</option>
                                        <option value="Completed">✅ Completed</option>
                                        <option value="Cancelled">❌ Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}