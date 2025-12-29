'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { electionsAPI, voteAPI } from '@/lib/api';

interface Candidate {
    candidateId: string;
    name: string;
    party: string;
    photo: string;
}

interface Election {
    electionId: string;
    title: string;
    description: string;
    candidates: Candidate[];
    startDate: string;
    endDate: string;
}

export default function VotePage() {
    const router = useRouter();
    const params = useParams();
    const electionId = params.id as string;

    const [election, setElection] = useState<Election | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [receipt, setReceipt] = useState<any>(null);

    useEffect(() => {
        loadElection();
    }, [electionId]);

    const loadElection = async () => {
        try {
            const response = await electionsAPI.getById(electionId);
            setElection(response.data.election);
        } catch (error) {
            console.error('Failed to load election:', error);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleVoteSubmit = async () => {
        if (!selectedCandidate) return;
        setSubmitting(true);

        try {
            const response = await voteAPI.cast(electionId, selectedCandidate);
            setReceipt(response.data.receipt);
            setShowConfirmation(false);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to cast vote');
        } finally {
            setSubmitting(false);
        }
    };

    const downloadReceipt = () => {
        const receiptData = `HYBRID E-VOTING SYSTEM
Vote Receipt
========================

Receipt ID: ${receipt.receiptId}
Vote Hash: ${receipt.voteHash}
Timestamp: ${new Date(receipt.timestamp).toLocaleString()}
Digital Signature: ${receipt.digitalSignature}

Verification URL: ${receipt.verificationUrl}

This receipt proves your vote was recorded.
You can verify it on the blockchain explorer.`;

        const blob = new Blob([receiptData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${receipt.receiptId}.txt`;
        a.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading election...</p>
                </motion.div>
            </div>
        );
    }

    if (receipt) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="card-premium">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="text-center mb-8"
                        >
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-bold text-gradient mb-2">Vote Cast Successfully!</h2>
                            <p className="text-gray-600">Your vote has been encrypted and recorded securely</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-100"
                        >
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">📄 Your Receipt</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Receipt ID</p>
                                    <p className="font-mono text-sm bg-white px-4 py-3 rounded-lg border-2 border-gray-200 shadow-sm">
                                        {receipt.receiptId}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Vote Hash</p>
                                    <p className="font-mono text-xs bg-white px-4 py-3 rounded-lg border-2 border-gray-200 break-all shadow-sm">
                                        {receipt.voteHash}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Timestamp</p>
                                    <p className="font-mono text-sm bg-white px-4 py-3 rounded-lg border-2 border-gray-200 shadow-sm">
                                        {new Date(receipt.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {receipt.qrCode && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-6 text-center"
                                >
                                    <p className="text-sm text-gray-600 mb-3">QR Code for Verification</p>
                                    <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                                        <img src={receipt.qrCode} alt="Receipt QR Code" className="w-48 h-48" />
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6"
                        >
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-900">
                                    <p className="font-bold mb-1">📌 Important Information</p>
                                    <p>Save this receipt to verify your vote was counted. You can check it on the blockchain explorer after the election ends.</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex gap-4">
                            <motion.button
                                onClick={downloadReceipt}
                                className="flex-1 btn-success"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                📥 Download Receipt
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/dashboard')}
                                className="flex-1 btn-secondary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                ← Back to Dashboard
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!election) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium mb-8"
                >
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center font-semibold"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>

                    <h1 className="text-4xl font-bold text-gradient mb-2">{election.title}</h1>
                    <p className="text-gray-600 text-lg">{election.description}</p>
                </motion.div>

                {/* Candidates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-premium"
                >
                    <h2 className="text-3xl font-bold text-gradient mb-6">🗳️ Select Your Candidate</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {election.candidates.map((candidate, index) => (
                            <motion.div
                                key={candidate.candidateId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                onClick={() => setSelectedCandidate(candidate.candidateId)}
                                className={`border-3 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${selectedCandidate === candidate.candidateId
                                        ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl'
                                        : 'border-gray-200 hover:border-blue-300 bg-white shadow-md'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {candidate.photo ? (
                                            <img src={candidate.photo} alt={candidate.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                                        <p className="text-sm text-gray-600">{candidate.party || 'Independent'}</p>
                                    </div>

                                    {selectedCandidate === candidate.candidateId && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex-shrink-0"
                                        >
                                            <div className="bg-blue-600 rounded-full p-2">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        onClick={() => setShowConfirmation(true)}
                        disabled={!selectedCandidate}
                        className="w-full mt-8 btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={selectedCandidate ? { scale: 1.02 } : {}}
                        whileTap={selectedCandidate ? { scale: 0.98 } : {}}
                    >
                        {selectedCandidate ? '✅ Cast Vote' : '⚠️ Select a Candidate'}
                    </motion.button>
                </motion.div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                        >
                            <h3 className="text-3xl font-bold text-gradient mb-4">Confirm Your Vote</h3>

                            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
                                <p className="text-sm text-yellow-900">
                                    <strong>⚠️ Warning:</strong> Once submitted, your vote cannot be changed. Please confirm your selection.
                                </p>
                            </div>

                            <p className="text-gray-700 mb-6 text-lg">
                                You are voting for:{' '}
                                <strong className="text-gradient text-xl">
                                    {election.candidates.find(c => c.candidateId === selectedCandidate)?.name}
                                </strong>
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={submitting}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVoteSubmit}
                                    disabled={submitting}
                                    className="flex-1 btn-success disabled:opacity-50"
                                >
                                    {submitting ? '⏳ Submitting...' : '✅ Confirm Vote'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
