import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, UtensilsCrossed, ShoppingBag, ChevronRight } from '../icons';

export default function Dashboard() {
    const [stats, setStats] = useState({ categories: 0, menuItems: 0, orders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [catRes, menuRes, orderRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/categories'),
                    axios.get('http://localhost:5000/api/menu-items'),
                    axios.get('http://localhost:5000/api/orders'),
                ]);
                setStats({ categories: catRes.data.length, menuItems: menuRes.data.length, orders: orderRes.data.length });
            } catch (error) { console.error('Error fetching statistics:', error); }
        };
        fetchStats();
    }, []);

    const user = JSON.parse(localStorage.getItem('user'));

    const cards = [
        { label: 'Total Orders',     value: stats.orders,     Icon: ShoppingBag,     href: '/orders',     desc: 'Customer orders placed'   },
        { label: 'Total Categories', value: stats.categories, Icon: Tag,             href: '/categories', desc: 'Active menu categories'    },
        { label: 'Total Menu Items', value: stats.menuItems,  Icon: UtensilsCrossed, href: '/menu-items', desc: 'Dishes on the menu'        },
    ];

    const quickActions = [
        { href: '/orders',     Icon: ShoppingBag,     label: 'View Orders',       desc: 'Track and update order status'   },
        { href: '/categories', Icon: Tag,             label: 'Manage Categories', desc: 'Add or edit food categories'     },
        { href: '/menu-items', Icon: UtensilsCrossed, label: 'Manage Menu Items', desc: 'Add dishes with prices & images' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Admin Dashboard Overview
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    Good to see you, <span className="text-orange-500">{user?.name?.split(' ')[0] || 'Admin'}</span> !
                </h2>
                <p className="text-stone-500 text-sm mt-1">Serving the most delicious meals to our community since 2010.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <a key={card.label} href={card.href}
                        className="group bg-white rounded-2xl border border-stone-100 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 overflow-hidden shadow-sm">
                        <div className="h-1 w-full bg-orange-500" />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                    <card.Icon className="w-5 h-5 text-orange-500" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-orange-500 transition-colors mt-1" />
                            </div>
                            <p className="text-4xl font-extrabold text-stone-900 mb-1">{card.value}</p>
                            <p className="text-sm font-bold text-stone-700">{card.label}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{card.desc}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.15em] mb-4">Quick Actions</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {quickActions.map(q => (
                        <a key={q.label} href={q.href}
                            className="group flex items-center gap-3 p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:border-orange-200 hover:bg-orange-50/40 transition-all duration-200">
                            <div className="w-9 h-9 bg-white border border-stone-100 group-hover:border-orange-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                                <q.Icon className="w-4 h-4 text-orange-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition-colors">{q.label}</p>
                                <p className="text-xs text-stone-400 truncate">{q.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                        </a>
                    ))}
                </div>
            </div>

            {/* ── Overview Hero Banner — White with Orange & Green Border ── */}
            <div className="rounded-2xl p-[2px] bg-gradient-to-r from-orange-500 to-green-500 shadow-xl">
                <div className="relative overflow-hidden rounded-[14px] p-6 md:p-8 bg-white h-full">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
                                Authentic Recipes &amp; Quality
                            </div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                                {stats.menuItems} Dishes · {stats.categories} Categories
                            </p>
                            <p className="text-stone-500 text-sm mt-1 font-medium">
                                {stats.orders} total pre-orders &amp; pickup orders received
                            </p>
                        </div>

                        {/* Stats pill strip */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                            {[
                                { label: 'Orders',     value: `${stats.orders}+`     },
                                { label: 'Dishes',     value: `${stats.menuItems}+`  },
                                { label: 'Categories', value: stats.categories        },
                            ].map((s, i, arr) => (
                                <div key={s.label} className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-extrabold text-orange-500">{s.value}</p>
                                        <p className="text-xs text-stone-500 mt-0.5 tracking-wide font-medium">{s.label}</p>
                                    </div>
                                    {i < arr.length - 1 && <div className="w-px h-8 bg-stone-200" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}