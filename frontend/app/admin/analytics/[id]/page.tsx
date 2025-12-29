'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PremiumAnalyticsPage() {
    const params = useParams();
    const router = useRouter();
    const [election, setElection] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/analytics/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setElection({
                    title: data.election.title,
                    status: data.election.status,
                    startDate: data.startDate,
                    endDate: data.endDate
                });
                setAnalytics({
                    totalVotes: data.totalVotes,
                    results: data.results,
                    votesPerHour: data.votesPerHour
                });
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!analytics || !analytics.results) return;

        const headers = ['Candidate,Party,Votes,Percentage'];
        const rows = analytics.results.map((candidate: any) => {
            const percentage = analytics.totalVotes > 0
                ? ((candidate.votes / analytics.totalVotes) * 100).toFixed(2)
                : 0;
            return `${candidate.name},${candidate.party || 'Independent'},${candidate.votes},${percentage}%`;
        });

        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `election-results-${params.id}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading analytics...</p>
                </motion.div>
            </div>
        );
    }

    if (!election || !analytics) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No data available</p>
                </div>
            </div>
        );
    }

    const pieData = analytics.results?.map((candidate: any, index: number) => ({
        name: candidate.name,
        value: candidate.votes,
        color: COLORS[index % COLORS.length]
    })) || [];

    const barData = analytics.results?.map((candidate: any) => ({
        name: candidate.name.length > 15 ? candidate.name.substring(0, 15) + '...' : candidate.name,
        votes: candidate.votes
    })) || [];

    const winner = analytics.results?.reduce((prev: any, current: any) =>
        (current.votes > prev.votes) ? current : prev
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center font-semibold"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-gradient mb-2">{election.title}</h1>
                        <p className="text-gray-600 text-lg">📊 Enhanced Analytics Dashboard</p>
                    </div>
                    <motion.button
                        onClick={exportToCSV}
                        className="btn-success"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        📥 Export to CSV
                    </motion.button>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Votes', value: analytics.totalVotes || 0, icon: '🗳️', gradient: 'from-blue-500 to-indigo-600' },
                        { label: 'Status', value: election.status, icon: '📊', gradient: 'from-green-500 to-emerald-600', capitalize: true },
                        { label: 'Candidates', value: analytics.results?.length || 0, icon: '👥', gradient: 'from-purple-500 to-pink-600' },
                        { label: 'Winner', value: winner?.name || 'TBD', icon: '🏆', gradient: 'from-orange-500 to-red-600', small: true }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="card-premium"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-bold text-gray-900 ${stat.capitalize ? 'capitalize' : ''} ${stat.small ? 'text-xl' : ''}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`text-5xl bg-gradient-to-br ${stat.gradient} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-premium"
                    >
                        <h2 className="text-2xl font-bold text-gradient mb-6">🥧 Vote Distribution</h2>
                        {analytics.totalVotes > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📊</div>
                                    <p>No votes cast yet</p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card-premium"
                    >
                        <h2 className="text-2xl font-bold text-gradient mb-6">📊 Candidate Comparison</h2>
                        {analytics.totalVotes > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="votes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📈</div>
                                    <p>No votes cast yet</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Results Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card-premium overflow-hidden"
                >
                    <h2 className="text-2xl font-bold text-gradient mb-6">🏆 Detailed Results</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">Rank</th>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">Candidate</th>
                                    <th className="text-right py-4 px-6 font-bold text-gray-700">Votes</th>
                                    <th className="text-right py-4 px-6 font-bold text-gray-700">Percentage</th>
                                    <th className="text-right py-4 px-6 font-bold text-gray-700">Visual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.results
                                    ?.sort((a: any, b: any) => b.votes - a.votes)
                                    .map((candidate: any, index: number) => {
                                        const votes = candidate.votes || 0;
                                        const percentage = analytics.totalVotes > 0
                                            ? ((votes / analytics.totalVotes) * 100).toFixed(2)
                                            : 0;

                                        return (
                                            <motion.tr
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-100 hover:bg-purple-50/50 transition"
                                            >
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                                                    'bg-gradient-to-br from-blue-400 to-blue-600'
                                                        }`}>
                                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-gray-900">{candidate.name}</div>
                                                    {candidate.party && (
                                                        <div className="text-sm text-gray-500">{candidate.party}</div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right text-xl font-bold text-blue-600">{votes}</td>
                                                <td className="py-4 px-6 text-right font-semibold">{percentage}%</td>
                                                <td className="py-4 px-6">
                                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full"
                                                        ></motion.div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
