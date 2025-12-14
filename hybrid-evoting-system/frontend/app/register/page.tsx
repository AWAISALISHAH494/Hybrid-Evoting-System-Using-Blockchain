'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nationalId: '',
        role: 'voter'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    nationalId: formData.nationalId,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/verify-otp?email=' + encodeURIComponent(formData.email));
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!formData.name || !formData.email)) {
            setError('Please fill in all fields');
            return;
        }
        if (step === 2 && (!formData.password || !formData.confirmPassword)) {
            setError('Please fill in all fields');
            return;
        }
        if (step === 2 && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 -right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl mb-4 float">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gradient mb-2">Create Account</h1>
                    <p className="text-gray-600">Join SecureVote in 3 easy steps</p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    className="flex justify-between mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1">
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${step > s ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                            <div className="text-xs text-center mt-2 text-gray-600 font-medium">
                                {s === 1 ? 'Info' : s === 2 ? 'Security' : 'Verify'}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Register Card */}
                <motion.div
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
                            >
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-premium"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-premium"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full btn-primary"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Continue
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Security */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input-premium"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="input-premium"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 btn-secondary"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 btn-primary"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Verification */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        National ID / CNIC
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nationalId}
                                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                                        className="input-premium"
                                        placeholder="12345-1234567-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Account Type
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input-premium"
                                    >
                                        <option value="voter">Voter</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="flex-1 btn-secondary"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-success"
                                    >
                                        {loading ? 'Creating...' : 'Create Account'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => router.push('/login')}
                                className="text-purple-600 font-semibold hover:text-purple-700 transition"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
