import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Check if the user has admin role
            if (response.data.user.role !== 'admin') {
                setError('Access denied. Admins only.');
                setIsLoading(false);
                return;
            }

            // Save token and user details to local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert('Login successful!');
            // Reload the page to update the App state and redirect to dashboard
            window.location.href = '/';

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200";
    const labelClass = "block text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-2";

    return (
        <div className="min-h-screen flex">

            {/* ── LEFT: Brand Panel ── */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-gray-900 via-orange-950 to-stone-900 flex-col items-center justify-center p-12 text-white">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <img src="/favicon.png" alt="MangoTree" className="h-14 w-14 object-contain" />
                        <div>
                            <p className="text-2xl font-extrabold text-white">Mango<span className="text-orange-400">Tree</span></p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300/70 bg-white/10 px-2 py-0.5 rounded-full">Admin Panel</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
                        Restaurant Management <span className="text-orange-400">Hub</span>
                    </h2>
                    <p className="text-orange-200/60 text-sm mb-10 leading-relaxed">
                        Manage your menu, categories, and customer orders from one powerful dashboard.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: '📊', title: 'Live Dashboard', desc: 'Real-time stats on orders, menu items, and categories' },
                            { icon: '🍽️', title: 'Menu Management', desc: 'Add, edit, and delete menu items instantly' },
                            { icon: '🚚', title: 'Order Tracking', desc: 'Update and track all customer orders live' },
                        ].map(f => (
                            <div key={f.title} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{f.icon}</div>
                                <div>
                                    <p className="text-sm font-bold text-white">{f.title}</p>
                                    <p className="text-xs text-orange-200/60">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Form Panel ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-50 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                        <img src="/favicon.png" alt="MangoTree" className="h-10 w-10 object-contain" />
                        <p className="text-xl font-extrabold text-gray-900">Mango<span className="text-orange-500">Tree</span> <span className="text-sm font-bold text-orange-400">Admin</span></p>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">Welcome back 👋</h1>
                        <p className="text-gray-400 text-sm mt-2">Sign in to access the admin dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="admin@mangotree.com"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 text-white font-bold text-sm rounded-full shadow-lg transition-all duration-200 active:scale-[0.98] mt-2 flex items-center justify-center gap-2 ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200 hover:shadow-orange-300'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In to Dashboard →'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-300 mt-8">
                        🔒 Restricted to authorised administrators only.
                    </p>
                </div>
            </div>
        </div>
    );
}