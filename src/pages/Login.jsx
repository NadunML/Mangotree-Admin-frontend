import { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Lock, Loader2, BarChart3, UtensilsCrossed, Truck } from '../icons';

export default function Login() {
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [error, setError]         = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (response.data.user.role !== 'admin') {
                setError('Access denied. Admins only.');
                setIsLoading(false);
                return;
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-stone-900 transition-all text-sm placeholder-stone-400";
    const labelClass = "block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5";

    const features = [
        { Icon: BarChart3,       title: 'Live Dashboard',  desc: 'Real-time stats on orders, menu items, and categories' },
        { Icon: UtensilsCrossed, title: 'Menu Management', desc: 'Add, edit, and delete menu items instantly'            },
        { Icon: Truck,           title: 'Order Tracking',  desc: 'Update and track all customer orders live'             },
    ];

    return (
        <div className="fixed inset-0 z-50 flex overflow-hidden" style={{ background: '#FAF9F6' }}>

            {/* ── LEFT: Brand panel — Dark Warm Chocolate Gradient ── */}
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 h-full text-white p-10 xl:p-16 relative gap-10 border-r border-amber-900/30"
                 style={{ background: 'linear-gradient(135deg, #140a05 0%, #341609 50%, #170a05 100%)' }}>
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-lg">
                    {/* Pill tag */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold mb-8">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        PRE-ORDER &amp; PICKUP · ADMIN PORTAL
                    </div>

                    {/* Brand Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/favicon.png" alt="MangoTree" className="h-10 w-10 object-contain flex-shrink-0" />
                        <div>
                            <p className="text-3xl font-extrabold text-white leading-none">
                                Mango<span className="text-orange-400">Tree</span>
                            </p>
                            <span className="text-[10px] font-bold text-orange-400/70 tracking-[0.15em] uppercase">Admin Panel</span>
                        </div>
                    </div>

                    <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
                        The True Taste of<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            Thalgaswala !
                        </span>
                    </h2>
                    <p className="text-amber-200/60 text-sm leading-relaxed border-l-2 border-orange-500/50 pl-4 mb-10">
                        Serving the most delicious meals to our community since 2010. Manage orders, dishes, and categories seamlessly.
                    </p>

                    <div className="space-y-3">
                        {features.map(f => (
                            <div key={f.title} className="flex items-center gap-4 bg-black/30 border border-amber-900/40 rounded-2xl p-4 shadow-sm">
                                <div className="w-10 h-10 bg-orange-500/15 border border-orange-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <f.Icon className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{f.title}</p>
                                    <p className="text-xs text-amber-200/50 mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Form panel — Warm Cream Background ── */}
            <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 lg:p-8 relative"
                 style={{ background: '#FAF9F6' }}>

                {/* Subtle orange glow top-right */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400/8 rounded-full blur-[80px] pointer-events-none" />

                <div className="w-full max-w-sm xl:max-w-md relative z-10">

                    {/* Mobile brand */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <img src="/favicon.png" alt="" className="h-8 w-8 object-contain" />
                        <p className="text-xl font-extrabold text-stone-900">
                            Mango<span className="text-orange-500">Tree</span>{' '}
                            <span className="text-sm text-orange-400 font-bold">Admin</span>
                        </p>
                    </div>

                    <div className="mb-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Authorised Access
                        </div>
                        <h1 className="text-2xl xl:text-3xl font-extrabold text-stone-900 mb-1.5">Welcome back</h1>
                        <p className="text-sm text-stone-500 font-medium">Sign in to your admin account to continue.</p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                required placeholder="admin@mangotree.com" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                required placeholder="••••••••" className={inputClass} />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded-xl text-sm shadow-lg transition-all duration-200 active:scale-[0.98] mt-2 ${
                                isLoading
                                    ? 'bg-stone-400 cursor-not-allowed shadow-none'
                                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                            }`}
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                            ) : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-stone-200 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                        <Lock className="w-3.5 h-3.5 text-orange-400" />
                        Restricted to authorised administrators only.
                    </div>
                </div>
            </div>
        </div>
    );
}