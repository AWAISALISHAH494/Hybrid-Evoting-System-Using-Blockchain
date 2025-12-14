'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { electionsAPI } from '@/lib/api';

export default function AdminDashboard() {
    const router = useRouter();
    const [elections, setElections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [{ name: '', party: '' }]
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        setUser(parsedUser);
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

    const handleFinalizeElection = async (electionId: string) => {
        if (!confirm('Finalize this election and store results on blockchain?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/finalize/${electionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.blockchainTxHash
                    ? `✅ Finalized!\n\nMerkle Root: ${data.merkleRoot}\n\nBlockchain TX: ${data.blockchainTxHash}\n\nView on Etherscan:\n${data.etherscanUrl}`
                    : `✅ Finalized!\n\nResult Hash: ${data.resultHash}`
                );
                loadElections();
            } else {
                alert('Failed to finalize election');
            }
        } catch (error) {
            alert('Error finalizing election');
        }
    };

    const handleCreateElection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/elections', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowCreateModal(false);
                setFormData({ title: '', description: '', startDate: '', endDate: '', candidates: [{ name: '', party: '' }] });
                loadElections();
            }
        } catch (error) {
            console.error('Failed to create election:', error);
        }
    };

    const addCandidate = () => {
        setFormData({
            ...formData,
            candidates: [...formData.candidates, { name: '', party: '' }]
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
                </motion.div>
            </div>
        );
    }

    const activeElections = elections.filter(e => e.status === 'active').length;
    const finalizedElections = elections.filter(e => e.status === 'finalized').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center space-x-3"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg float">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gradient">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                        </motion.div>
                        <motion.button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 border-2 border-gray-200 transition shadow-md"
                            whileHover={{ scale: 1.05 }}
                        >
                            Logout
                        </motion.button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Elections', value: elections.length, icon: '📊', gradient: 'from-blue-500 to-indigo-600' },
                        { label: 'Active', value: activeElections, icon: '✅', gradient: 'from-green-500 to-emerald-600' },
                        { label: 'Finalized', value: finalizedElections, icon: '🔒', gradient: 'from-purple-500 to-pink-600' },
                        { label: 'On Blockchain', value: finalizedElections, icon: '⛓️', gradient: 'from-orange-500 to-red-600' }
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
                                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`text-5xl bg-gradient-to-br ${stat.gradient} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gradient mb-2">Manage Elections</h2>
                        <p className="text-gray-600">Create, monitor, and finalize elections</p>
                    </div>
                    <motion.button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-success"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="flex items-center gap-2">
                            ➕ Create Election
                        </span>
                    </motion.button>
                </div>

                {/* Elections Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card-premium overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">Election</th>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">Status</th>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">Start Date</th>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">End Date</th>
                                    <th className="text-left py-4 px-6 font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elections.map((election, index) => (
                                    <motion.tr
                                        key={election.electionId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 hover:bg-purple-50/50 transition"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-gray-900">{election.title}</div>
                                            <div className="text-sm text-gray-500">{election.candidates?.length || 0} candidates</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {election.status === 'active' && <span className="status-active">Active</span>}
                                            {election.status === 'pending' && <span className="status-pending">Pending</span>}
                                            {election.status === 'ended' && <span className="status-ended">Ended</span>}
                                            {election.status === 'finalized' && <span className="status-finalized">Finalized</span>}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(election.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(election.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/analytics/${election.electionId}`)}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                                >
                                                    Analytics
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/manage/${election.electionId}`)}
                                                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                                                >
                                                    Manage
                                                </button>
                                                {election.status === 'ended' && (
                                                    <button
                                                        onClick={() => handleFinalizeElection(election.electionId)}
                                                        className="text-green-600 hover:text-green-700 font-semibold text-sm"
                                                    >
                                                        Finalize
                                                    </button>
                                                )}
                                                {election.status === 'finalized' && (
                                                    <span className="text-green-600 font-semibold text-sm">✓ Done</span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Create Election Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                    >
                        <h2 className="text-3xl font-bold text-gradient mb-6">Create New Election</h2>
                        <form onSubmit={handleCreateElection} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-premium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-premium"
                                    rows={3}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Candidates</label>
                                {formData.candidates.map((candidate, index) => (
                                    <div key={index} className="grid md:grid-cols-2 gap-4 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Candidate Name"
                                            required
                                            value={candidate.name}
                                            onChange={(e) => {
                                                const newCandidates = [...formData.candidates];
                                                newCandidates[index].name = e.target.value;
                                                setFormData({ ...formData, candidates: newCandidates });
                                            }}
                                            className="input-premium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Party (optional)"
                                            value={candidate.party}
                                            onChange={(e) => {
                                                const newCandidates = [...formData.candidates];
                                                newCandidates[index].party = e.target.value;
                                                setFormData({ ...formData, candidates: newCandidates });
                                            }}
                                            className="input-premium"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCandidate}
                                    className="text-purple-600 font-semibold text-sm hover:text-purple-700"
                                >
                                    + Add Candidate
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-success">
                                    Create Election
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
