'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
    receiptId: string;
    voteHash: string;
    timestamp: string;
    electionId: string;
    blockchainTxHash?: string;
}

export default function BlockchainExplorerPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<Transaction | null>(null);

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    const fetchRecentTransactions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/explorer/recent');
            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions || []);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/api/vote/verify/${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResult(data.receipt);
            } else {
                alert('Receipt not found');
                setSearchResult(null);
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
                            <p className="text-blue-100 mt-1">Verify votes on Ethereum Sepolia</p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Vote Receipt</h2>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Receipt ID (e.g., RECEIPT-1234567890-ABC123)"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                        >
                            Search
                        </button>
                    </form>

                    {searchResult && (
                        <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                            <h3 className="font-bold text-green-900 mb-4 flex items-center">
                                <span className="text-2xl mr-2">✓</span>
                                Vote Found and Verified
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-semibold">Receipt ID:</span> {searchResult.receiptId}</div>
                                <div><span className="font-semibold">Vote Hash:</span> <span className="font-mono text-xs">{searchResult.voteHash}</span></div>
                                <div><span className="font-semibold">Timestamp:</span> {new Date(searchResult.timestamp).toLocaleString()}</div>
                                {searchResult.blockchainTxHash && (
                                    <div>
                                        <span className="font-semibold">Blockchain TX:</span>{' '}
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${searchResult.blockchainTxHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-mono text-xs"
                                        >
                                            {searchResult.blockchainTxHash}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Votes</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No votes recorded yet</p>
                            <p className="text-sm mt-2">Votes will appear here once cast</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Receipt ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Vote Hash</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-mono text-sm">{tx.receiptId}</td>
                                            <td className="py-4 px-4 font-mono text-xs text-gray-600">
                                                {tx.voteHash.substring(0, 16)}...
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => router.push(`/verify/${tx.receiptId}`)}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                                >
                                                    Verify →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Smart Contract Info */}
                <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-bold mb-4">Smart Contract Information</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="text-purple-100 text-sm mb-1">VoteStorage Contract</div>
                            <a
                                href="https://sepolia.etherscan.io/address/0xfEe71B9cD3514a3C0819bf39A8e433733680Ca75"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm hover:underline"
                            >
                                0xfEe71B9cD3514a3C0819bf39A8e433733680Ca75
                            </a>
                        </div>
                        <div>
                            <div className="text-purple-100 text-sm mb-1">Network</div>
                            <div className="font-semibold">Ethereum Sepolia Testnet</div>
                        </div>
                        <div>
                            <div className="text-purple-100 text-sm mb-1">Block Explorer</div>
                            <a
                                href="https://sepolia.etherscan.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                sepolia.etherscan.io →
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
