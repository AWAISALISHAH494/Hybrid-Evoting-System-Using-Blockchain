'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            router.push('/login');
        }
    }, [userId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP(userId!, otp);

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.removeItem('tempUserId');

            // Redirect based on role
            if (response.data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }

        } catch (err: any) {
            setError(err.response?.data?.error || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
                        <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                className="input-field text-center text-2xl tracking-widest"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Code expires in 10 minutes
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Didn't receive the code?{' '}
                            <button className="text-blue-600 hover:text-blue-700 font-semibold">
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
