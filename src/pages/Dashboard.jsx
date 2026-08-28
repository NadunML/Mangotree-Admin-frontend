import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    // State to hold our dashboard statistics
    const [stats, setStats] = useState({
        categories: 0,
        menuItems: 0,
        orders: 0
    });

    useEffect(() => {
        // Function to fetch all data and calculate counts
        const fetchStats = async () => {
            try {
                // Fetching data from all three endpoints
                const catRes = await axios.get('http://localhost:5000/api/categories');
                const menuRes = await axios.get('http://localhost:5000/api/menu-items');
                const orderRes = await axios.get('http://localhost:5000/api/orders');

                // Updating the state with the length of each array
                setStats({
                    categories: catRes.data.length,
                    menuItems: menuRes.data.length,
                    orders: orderRes.data.length
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStats();
    }, []);

    const user = JSON.parse(localStorage.getItem('user'));

    // ── Strict 2-accent palette from the logo ──────────────────────────────
    // Orange = mango body  |  Lime = leaf/swoosh  |  Amber = warm mid-tone
    const cards = [
        {
            label: 'Total Categories',
            value: stats.categories,
            icon: '🏷️',
            bar: 'from-orange-400 to-orange-500',
            iconBg: 'bg-orange-50',
            valueColor: 'text-orange-500',
            desc: 'Active menu categories',
        },
        {
            label: 'Total Menu Items',
            value: stats.menuItems,
            icon: '🍽️',
            bar: 'from-amber-400 to-orange-500',
            iconBg: 'bg-amber-50',
            valueColor: 'text-amber-600',
            desc: 'Dishes on the menu',
        },
        {
            label: 'Total Orders',
            value: stats.orders,
            icon: '📦',
            bar: 'from-lime-500 to-lime-600',
            iconBg: 'bg-lime-50',
            valueColor: 'text-lime-700',
            desc: 'All-time customer orders',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Welcome back, <span className="font-semibold text-gray-600">{user?.name?.split(' ')[0]}</span>. Here's your restaurant at a glance.
                    </p>
                </div>
                {/* Live pill — lime (leaf green = "active/live") */}
                <div className="flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-2 text-xs font-semibold text-lime-700 self-start">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                    Live Data
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        {/* Accent bar — orange → amber → lime gradient across 3 cards */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${card.bar}`} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                                    {card.icon}
                                </div>
                                <span className={`text-3xl font-extrabold ${card.valueColor}`}>{card.value}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-base">{card.label}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick Actions ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">⚡</span>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { href: '/categories', icon: '🏷️', label: 'Manage Categories', desc: 'Add or edit food categories' },
                        { href: '/menu-items', icon: '🍽️', label: 'Manage Menu Items', desc: 'Add dishes with prices & images' },
                        { href: '/orders',     icon: '📦', label: 'View Orders',        desc: 'Track and update order status' },
                    ].map(q => (
                        <a
                            key={q.label}
                            href={q.href}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-orange-100 rounded-xl flex items-center justify-center text-xl transition-colors flex-shrink-0">
                                {q.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{q.label}</p>
                                <p className="text-xs text-gray-400 truncate">{q.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* ── At-a-glance summary strip ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-orange-950 to-stone-900 p-6 text-white">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-orange-300/80 text-xs font-bold uppercase tracking-widest mb-1">Restaurant Overview</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                            {stats.menuItems} dishes across {stats.categories} categories
                        </p>
                        <p className="text-orange-200/60 text-sm mt-1">
                            {stats.orders} orders placed by customers so far
                        </p>
                    </div>
                    <div className="flex gap-6 flex-shrink-0">
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-orange-400">{stats.categories}</p>
                            <p className="text-xs text-orange-300/60 mt-0.5">Categories</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-amber-400">{stats.menuItems}</p>
                            <p className="text-xs text-orange-300/60 mt-0.5">Menu Items</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-lime-400">{stats.orders}</p>
                            <p className="text-xs text-orange-300/60 mt-0.5">Orders</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}