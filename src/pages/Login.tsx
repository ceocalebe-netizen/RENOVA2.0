
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';
import banner from '../assets/login-banner.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setError('Success! Check your email for confirmation.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-900 text-white font-sans overflow-hidden">
            {/* Left Side - Form (40%) */}
            <div className="w-full md:w-[40%] flex flex-col justify-center items-center px-8 md:px-12 bg-slate-950 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <img src={logo} alt="Renova Logo" className="h-20 mx-auto mb-6 object-contain" />
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            {isSignUp ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            {isSignUp ? 'Enter your details to get started' : 'Please enter your details to sign in'}
                        </p>
                    </div>

                    {/* Error / Success Message */}
                    {error && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${error.startsWith('Success') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                                        placeholder="broker@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Toggle */}
                    <p className="mt-8 text-center text-sm text-slate-400">
                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                            className="font-medium text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                        >
                            {isSignUp ? 'Sign in' : 'Sign up for free'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Side - Banner (60%) */}
            <div className="hidden md:block md:w-[60%] relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
                    style={{ backgroundImage: `url(${banner})` }}
                ></div>
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

                {/* Banner Content */}
                <div className="absolute bottom-16 left-12 max-w-2xl px-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
                        Enterprise Grade
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Insurance Management</span>
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                        Experience the next generation of broker tools. Streamline your workflow, manage clients efficiently, and grow your business with Renova.
                    </p>
                </div>
            </div>
        </div>
    );
}
