import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, BookOpen, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock login
        if (role === 'admin') navigate('/admin');
        else if (role === 'faculty') navigate('/faculty');
        else navigate('/student');
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50/30 flex">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }} />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />

                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold tracking-tight">CoachingPlatform</span>
                    </div>

                    <div className="max-w-md space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-display font-bold leading-tight">
                                Welcome Back!
                            </h2>
                            <p className="text-primary-100 text-xl leading-relaxed">
                                Access your personalized dashboard to track progress, solve doubts with AI, and ace your exams.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-primary-200">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
                                <span className="text-sm">AI-Powered Learning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                                <span className="text-sm">Real-time Analytics</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-primary-200/80">
                        © 2024 CoachingPlatform. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-10 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold text-neutral-900">CoachingPlatform</span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-neutral-900">Sign in</h2>
                        <p className="mt-2 text-neutral-600">Welcome back! Please enter your details.</p>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-10">
                        <h2 className="text-4xl font-display font-bold text-neutral-900 mb-3">Sign in</h2>
                        <p className="text-lg text-neutral-600">
                            Welcome back! Please enter your details to access your account.
                        </p>
                    </div>

                    <Card className="border-0 shadow-large">
                        <CardContent className="p-8">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <Input
                                    label="Email address"
                                    type="email"
                                    placeholder="you@example.com"
                                    icon={<User className="w-5 h-5" />}
                                    required
                                />

                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        icon={<Lock className="w-5 h-5" />}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Role (Development)
                                    </label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="input"
                                    >
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-3 block text-sm text-neutral-700 font-medium">
                                            Remember me
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full shadow-glow hover:shadow-glow-lg"
                                    loading={isLoading}
                                    icon={!isLoading && <ArrowRight className="w-5 h-5" />}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-neutral-500">
                                    Don't have an account?{' '}
                                    <button className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                                        Contact your administrator
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
