import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    ShoppingBag, CheckCircle2, Banknote, RefreshCw,
    Receipt, Clock, Loader2, ShoppingCart, XCircle, CreditCard,
} from '../icons';

const STATUS_CONFIG = {
    'Pending':          { badge: 'bg-stone-100 text-stone-600 border border-stone-200',           dot: 'bg-stone-400',   Icon: Clock        },
    'Processing':       { badge: 'bg-orange-100 text-orange-700 border border-orange-200',        dot: 'bg-orange-500', Icon: Loader2      },
    'Ready for Pickup': { badge: 'bg-amber-100 text-amber-700 border border-amber-200',           dot: 'bg-amber-400',  Icon: ShoppingCart },
    'Completed':        { badge: 'bg-stone-800 text-white border border-stone-700',               dot: 'bg-orange-400', Icon: CheckCircle2 },
    'Cancelled':        { badge: 'bg-stone-100 text-stone-400 border border-stone-200',           dot: 'bg-stone-300',  Icon: XCircle      },
};

export default function Orders() {
    const [orders, setOrders]         = useState([]);
    const [newOrderIds, setNewOrderIds] = useState(new Set());
    const prevMaxIdRef                = useRef(null);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            const data = res.data;
            setOrders(data);

            if (data.length > 0) {
                const maxId = Math.max(...data.map(o => o.id));

                if (prevMaxIdRef.current === null) {
                    // first load: mark the single latest as "new" for 8s
                    prevMaxIdRef.current = maxId;
                    setNewOrderIds(new Set([maxId]));
                    setTimeout(() => setNewOrderIds(new Set()), 8000);
                } else if (maxId > prevMaxIdRef.current) {
                    // new orders arrived since last fetch
                    const freshIds = new Set(data.filter(o => o.id > prevMaxIdRef.current).map(o => o.id));
                    prevMaxIdRef.current = maxId;
                    setNewOrderIds(freshIds);
                    setTimeout(() => setNewOrderIds(new Set()), 8000);
                }
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (e) { console.error(e); }
    };

    const totalRevenue   = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const completedCount = orders.filter(o => o.status === 'Completed').length;

    return (
        <div className="space-y-6">

            {/* ── Controls ── */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500 font-medium">{orders.length} total orders recorded</p>
                <button onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 text-sm font-semibold rounded-full hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
                </button>
            </div>

            {/* ── Stat strip ── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { Icon: ShoppingBag,  value: orders.length,                          label: 'Total Orders', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { Icon: CheckCircle2, value: completedCount,                         label: 'Completed',    color: 'text-stone-800',   bg: 'bg-stone-100' },
                    { Icon: Banknote,     value: `Rs. ${totalRevenue.toLocaleString()}`, label: 'Revenue',      color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <s.Icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className={`text-lg font-extrabold ${s.color} truncate`}>{s.value}</p>
                            <p className="text-xs text-stone-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Status summary pills ── */}
            {orders.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                        const count = orders.filter(o => (o.status || 'Pending') === status).length;
                        if (count === 0) return null;
                        return (
                            <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {status} <span className="font-extrabold opacity-60">({count})</span>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* ── Orders list ── */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-20 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-10 h-10 text-orange-200" />
                        </div>
                        <p className="text-stone-700 font-bold">No orders found yet</p>
                        <p className="text-stone-400 text-sm mt-1">Customer orders will appear here once placed.</p>
                    </div>
                ) : (
                    orders.map(order => {
                        const status     = order.status || 'Pending';
                        const cfg        = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
                        const StatusIcon = cfg.Icon;
                        const isNew      = newOrderIds.has(order.id);

                        return (
                            <div
                                key={order.id}
                                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${
                                    isNew
                                        ? 'new-order-card border-orange-400 shadow-orange-100 shadow-lg'
                                        : 'border-stone-100 hover:shadow-md hover:border-orange-100'
                                }`}
                            >
                                {/* NEW badge banner */}
                                {isNew && (
                                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                                )}

                                {/* Card header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-stone-50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isNew ? 'bg-orange-100' : 'bg-orange-50'}`}>
                                            <Receipt className={`w-5 h-5 ${isNew ? 'text-orange-600' : 'text-orange-500'}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-stone-900 text-base">
                                                    #MT-{String(order.id).padStart(4, '0')}
                                                </p>
                                                {isNew && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold tracking-wider uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-0.5">
                                                {order.created_at && (
                                                    <p className="text-xs text-stone-400 font-medium">
                                                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                )}
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">
                                                    <Clock className="w-3 h-3" />
                                                    Pickup: {order.pickup_time || 'Not Set'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 ml-14 md:ml-0">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                                            <CreditCard className="w-3 h-3 text-stone-500" /> {order.payment_method}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                            <StatusIcon className="w-3.5 h-3.5" /> {status}
                                        </span>
                                        <span className="text-lg font-extrabold text-stone-900">
                                            Rs. {Number(order.total_amount).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Card body — items table */}
                                <div className="px-5 sm:px-6 py-4">
                                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-2">Dishes Ordered</p>
                                    {order.items && order.items.length > 0 ? (
                                        <div className="overflow-x-auto rounded-xl border border-stone-100">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-stone-50 text-left">
                                                        <th className="px-4 py-2.5 text-xs font-bold text-stone-500 uppercase tracking-wide">Item</th>
                                                        <th className="px-4 py-2.5 text-xs font-bold text-stone-500 uppercase tracking-wide text-center">Qty</th>
                                                        <th className="px-4 py-2.5 text-xs font-bold text-stone-500 uppercase tracking-wide text-right">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-50">
                                                    {order.items.map(item => (
                                                        <tr key={item.id} className="bg-white hover:bg-orange-50/30 transition-colors">
                                                            <td className="px-4 py-3 font-semibold text-stone-800">{item.item_name}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                                                                    ×{item.quantity}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-bold text-stone-900">
                                                                Rs. {(item.price * item.quantity).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-stone-400 text-sm">No items recorded.</p>
                                    )}
                                </div>

                                {/* Card footer — status update */}
                                <div className="px-5 sm:px-6 py-3 bg-stone-50/80 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        Current Status: <span className="font-bold text-stone-800">{status}</span>
                                    </p>
                                    <select
                                        value={status}
                                        onChange={e => handleStatusChange(order.id, e.target.value)}
                                        className="px-4 py-2 text-sm font-semibold text-stone-700 bg-white border-2 border-stone-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer hover:border-orange-300"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Ready for Pickup">Ready for Pickup</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
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