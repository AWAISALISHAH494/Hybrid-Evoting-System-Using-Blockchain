'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ManageElectionPage() {
    const params = useParams();
    const router = useRouter();
    const [election, setElection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchElection();
    }, []);

    const fetchElection = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/elections/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setElection(data.election);
                setTitle(data.election.title);
                setDescription(data.election.description);
                setStartDate(new Date(data.election.startDate).toISOString().slice(0, 16));
                setEndDate(new Date(data.election.endDate).toISOString().slice(0, 16));
            }
        } catch (error) {
            console.error('Failed to fetch election:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/elections/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                })
            });

            if (response.ok) {
                alert('Election updated successfully!');
                router.push('/admin/dashboard');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update election');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update election');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/elections/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Election deleted successfully');
                router.push('/admin/dashboard');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete election');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete election');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Election</h1>
                    <p className="text-gray-600 mt-2">Update election details or delete the election</p>
                </div>

                {/* Update Form */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Election Details</h2>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                            >
                                Update Election
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">
                        Deleting an election is permanent and cannot be undone. All votes and data will be lost.
                    </p>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Delete Election
                    </button>
                </div>
            </div>
        </div>
    );
}
