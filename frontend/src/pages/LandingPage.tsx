import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">CoachingPlatform</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-30">
                        <div className="w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 mt-20 -ml-20"></div>
                    </div>

                    <div className="text-center max-w-4xl mx-auto relative z-10">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
                            <Star className="w-4 h-4 mr-2 fill-current" />
                            Trusted by Top Educators
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                            Master Your Exams with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                AI-Powered Coaching
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Experience personalized learning with real-time AI doubt solving, comprehensive performance analytics, and adaptive mock exams.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transform hover:-translate-y-1"
                            >
                                Start Learning Now
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:border-gray-300">
                                View Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Brain className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Doubt Solver</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get instant answers to your questions 24/7. Our AI tutor explains complex concepts simply and helps you learn faster.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Analytics</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track your progress with detailed insights. Identify weak areas and compare your performance with batch averages.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptive Exams</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Practice with exams that match real testing conditions. Auto-save functionality ensures you never lose progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">CoachingPlatform</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 CoachingPlatform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
