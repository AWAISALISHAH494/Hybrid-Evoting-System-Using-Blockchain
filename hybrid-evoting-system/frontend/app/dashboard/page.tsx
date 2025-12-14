'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { electionsAPI } from '@/lib/api';

interface Election {
    electionId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    candidates: any[];
}

export default function VoterDashboard() {
    const router = useRouter();
    const [elections, setElections] = useState<Election[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));
        loadElections();
    }, [router]);

    const loadElections = async () => {
        try {
            const response = await electionsAPI.getAll();
            setElections(response.data.elections);
        } catch (error) {
            console.error('Failed to load elections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const getStatusBadge = (election: Election) => {
        const now = new Date();
        const start = new Date(election.startDate);
        const end = new Date(election.endDate);

        if (now < start) {
            return <span className="status-pending">⏳ Upcoming</span>;
        } else if (now > end) {
            return <span className="status-ended">🏁 Ended</span>;
        } else {
            return <span className="status-active">✅ Active</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    const activeElections = elections.filter(e => {
        const now = new Date();
        return now >= new Date(e.startDate) && now <= new Date(e.endDate);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center space-x-3"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg float">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gradient">Voter Dashboard</h1>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                        </motion.div>
                        <motion.button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 border-2 border-gray-200 transition shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Logout
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Total Elections', value: elections.length, icon: '📊', gradient: 'from-blue-500 to-indigo-600' },
                        { label: 'Active Now', value: activeElections.length, icon: '✅', gradient: 'from-green-500 to-emerald-600' },
                        { label: 'Your Votes', value: '0', icon: '🗳️', gradient: 'from-purple-500 to-pink-600' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="card-premium"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`text-5xl bg-gradient-to-br ${stat.gradient} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Elections Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gradient mb-2">Available Elections</h2>
                            <p className="text-gray-600">Select an election to cast your secure vote</p>
                        </div>
                    </div>

                    {elections.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-premium text-center py-16"
                        >
                            <div className="text-6xl mb-4">🗳️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Elections Available</h3>
                            <p className="text-gray-600">Check back later for upcoming elections!</p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {elections.map((election, index) => (
                                <motion.div
                                    key={election.electionId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="card-premium group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gradient transition">
                                            {election.title}
                                        </h3>
                                        {getStatusBadge(election)}
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2">{election.description}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(election.startDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {election.candidates.length} Candidates
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/vote/${election.electionId}`)}
                                        disabled={election.status === 'ended'}
                                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {election.status === 'ended' ? '🏁 Election Ended' : '🗳️ Vote Now'}
                                        </span>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
