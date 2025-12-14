'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerifyReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        verifyReceipt();
    }, []);

    const verifyReceipt = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/vote/verify/${params.receiptId}`);

            if (response.ok) {
                const data = await response.json();
                setReceipt(data.receipt);
                setVerified(data.verified);
            } else {
                console.error('Receipt not found');
            }
        } catch (error) {
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying receipt...</p>
                </div>
            </div>
        );
    }

    if (!receipt) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="text-red-600 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Not Found</h1>
                    <p className="text-gray-600 mb-6">The receipt ID you provided could not be found in our system.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-block p-4 rounded-full mb-4 ${verified ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className={`text-6xl ${verified ? 'text-green-600' : 'text-red-600'}`}>
                            {verified ? '✓' : '✗'}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {verified ? 'Vote Verified!' : 'Verification Failed'}
                    </h1>
                    <p className="text-gray-600">
                        {verified
                            ? 'Your vote has been successfully verified on the blockchain'
                            : 'There was an issue verifying your vote'}
                    </p>
                </div>

                {/* Receipt Details */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Receipt Details</h2>

                    <div className="space-y-4">
                        <div className="border-b pb-4">
                            <div className="text-sm text-gray-600 mb-1">Receipt ID</div>
                            <div className="font-mono text-sm break-all">{receipt.receiptId}</div>
                        </div>

                        <div className="border-b pb-4">
                            <div className="text-sm text-gray-600 mb-1">Vote Hash</div>
                            <div className="font-mono text-sm break-all">{receipt.voteHash}</div>
                        </div>

                        <div className="border-b pb-4">
                            <div className="text-sm text-gray-600 mb-1">Timestamp</div>
                            <div className="text-sm">{new Date(receipt.timestamp).toLocaleString()}</div>
                        </div>

                        <div className="border-b pb-4">
                            <div className="text-sm text-gray-600 mb-1">Election ID</div>
                            <div className="text-sm">{receipt.electionId}</div>
                        </div>

                        {receipt.blockchainTxHash && (
                            <div className="pt-4">
                                <div className="text-sm text-gray-600 mb-2">Blockchain Transaction</div>
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${receipt.blockchainTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-mono text-sm break-all underline"
                                >
                                    {receipt.blockchainTxHash}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Verification Status */}
                <div className={`rounded-xl p-6 ${verified ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <h3 className={`font-bold mb-2 ${verified ? 'text-green-900' : 'text-red-900'}`}>
                        {verified ? '✓ Verification Successful' : '✗ Verification Failed'}
                    </h3>
                    <p className={`text-sm ${verified ? 'text-green-700' : 'text-red-700'}`}>
                        {verified
                            ? 'This receipt is valid and your vote has been counted in the election.'
                            : 'This receipt could not be verified. Please contact support if you believe this is an error.'}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-8 text-center space-x-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition border-2 border-blue-600"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}
