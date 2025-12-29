'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen">
            {/* Premium Header */}
            <header className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center space-x-3"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-white p-2 rounded-xl shadow-lg float">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">SecureVote</h1>
                                <p className="text-xs text-blue-100">Blockchain E-Voting</p>
                            </div>
                        </motion.div>
                        <motion.nav
                            className="hidden md:flex space-x-6"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <a href="/login" className="hover:text-blue-200 transition font-medium">Login</a>
                            <a href="/register" className="hover:text-blue-200 transition font-medium">Register</a>
                            <a href="/explorer" className="hover:text-blue-200 transition font-medium">Explorer</a>
                        </motion.nav>
                    </div>
                </div>
            </header>

            {/* Hero Section with Animated Background */}
            <section className="relative overflow-hidden bg-animated py-32">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center text-white"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/30 shadow-xl">
                                🔐 Powered by Ethereum Blockchain
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight"
                        >
                            Secure, Transparent
                            <br />
                            <span className="text-yellow-300">Blockchain Voting</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed"
                        >
                            Experience the future of democracy with cryptographically verified elections,
                            Merkle tree proofs, and immutable blockchain records.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        >
                            <button
                                onClick={() => router.push('/register')}
                                className="group relative px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>

                            <button
                                onClick={() => router.push('/explorer')}
                                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-lg border-2 border-white/30 shadow-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                            >
                                Explore Blockchain
                            </button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-16 flex justify-center gap-12 text-sm"
                        >
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-300">256-bit</div>
                                <div className="text-blue-100">Encryption</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-300">100%</div>
                                <div className="text-blue-100">Verifiable</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-300">∞</div>
                                <div className="text-blue-100">Immutable</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gradient mb-4">
                            Why Choose SecureVote?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Enterprise-grade security meets user-friendly design
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🔐",
                                title: "End-to-End Encryption",
                                description: "AES-256-GCM encryption ensures your vote remains private and secure",
                                gradient: "from-blue-500 to-indigo-600"
                            },
                            {
                                icon: "🌳",
                                title: "Merkle Tree Verification",
                                description: "Cryptographically prove your vote was counted without revealing your choice",
                                gradient: "from-purple-500 to-pink-600"
                            },
                            {
                                icon: "⛓️",
                                title: "Blockchain Immutability",
                                description: "Results stored on Ethereum Sepolia - permanent and publicly auditable",
                                gradient: "from-green-500 to-emerald-600"
                            },
                            {
                                icon: "🤖",
                                title: "AI Anomaly Detection",
                                description: "Machine learning monitors voting patterns to detect fraud in real-time",
                                gradient: "from-orange-500 to-red-600"
                            },
                            {
                                icon: "📊",
                                title: "Real-Time Analytics",
                                description: "Beautiful dashboards with live vote counts and interactive charts",
                                gradient: "from-cyan-500 to-blue-600"
                            },
                            {
                                icon: "✅",
                                title: "Instant Verification",
                                description: "Get cryptographic receipts and verify your vote on the blockchain",
                                gradient: "from-violet-500 to-purple-600"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="card-premium group cursor-pointer"
                            >
                                <div className={`text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-500 rounded-full`}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h2 className="text-5xl font-bold mb-6">
                            Ready to Experience the Future?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Join thousands of voters using blockchain technology for secure, transparent elections
                        </p>
                        <button
                            onClick={() => router.push('/register')}
                            className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                        >
                            Create Your Account →
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">SecureVote</h3>
                        <p className="text-gray-400">Blockchain-Powered Democracy</p>
                    </div>
                    <div className="flex justify-center gap-8 mb-6">
                        <a href="/explorer" className="hover:text-white transition">Blockchain Explorer</a>
                        <a href="/login" className="hover:text-white transition">Login</a>
                        <a href="/register" className="hover:text-white transition">Register</a>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2025 SecureVote. Powered by Ethereum Sepolia Testnet.
                    </div>
                </div>
            </footer>
        </div>
    );
}
