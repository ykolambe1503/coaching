import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Sparkles,
  Users,
  Award,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Brain,
            title: 'AI Doubt Solver',
            description: 'Get instant answers to your questions 24/7. Our AI tutor explains complex concepts simply and helps you learn faster.',
            color: 'primary' as const,
        },
        {
            icon: TrendingUp,
            title: 'Performance Analytics',
            description: 'Track your progress with detailed insights. Identify weak areas and compare your performance with batch averages.',
            color: 'success' as const,
        },
        {
            icon: CheckCircle,
            title: 'Adaptive Exams',
            description: 'Practice with exams that match real testing conditions. Auto-save functionality ensures you never lose progress.',
            color: 'warning' as const,
        },
    ];

    const stats = [
        { label: 'Active Students', value: '10,000+', icon: Users },
        { label: 'Success Rate', value: '95%', icon: Award },
        { label: 'Expert Faculty', value: '500+', icon: Star },
        { label: 'Study Hours', value: '1M+', icon: Clock },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
            {/* Navbar */}
            <nav className="fixed w-full glass z-50 border-b border-white/20">
                <div className="container-fluid">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold text-neutral-900 tracking-tight">
                                CoachingPlatform
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/login')}
                                className="text-neutral-600 hover:text-neutral-900"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                className="shadow-glow hover:shadow-glow-lg"
                                icon={<Sparkles className="w-4 h-4" />}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="section-padding pt-32 lg:pt-40 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-secondary-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
                </div>

                <div className="container-fluid relative z-10">
                    <div className="text-center max-w-5xl mx-auto animate-in">
                        <Badge variant="primary" className="mb-8 animate-bounce-subtle">
                            <Star className="w-4 h-4 mr-2 fill-current" />
                            Trusted by Top Educators Nationwide
                        </Badge>
                        
                        <h1 className="text-6xl lg:text-8xl font-display font-black text-neutral-900 tracking-tight mb-8 leading-tight">
                            Master Your Exams with{' '}
                            <span className="text-gradient-primary">
                                AI-Powered Coaching
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            Experience personalized learning with real-time AI doubt solving, comprehensive performance analytics, and adaptive mock exams designed for MPSC/UPSC success.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                            <Button
                                size="xl"
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto shadow-large hover:shadow-glow-lg"
                                icon={<Zap className="w-5 h-5" />}
                            >
                                Start Learning Now
                            </Button>
                            <Button
                                variant="secondary"
                                size="xl"
                                className="w-full sm:w-auto"
                            >
                                View Demo
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 mb-3">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-neutral-500 font-medium">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section-padding bg-gradient-to-b from-white to-neutral-50">
                <div className="container-fluid">
                    <div className="text-center mb-16">
                        <Badge variant="primary" className="mb-4">
                            <Shield className="w-4 h-4 mr-2" />
                            Powerful Features
                        </Badge>
                        <h2 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-6">
                            Everything you need to{' '}
                            <span className="text-gradient-accent">succeed</span>
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Our comprehensive platform combines cutting-edge AI technology with proven educational methodologies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const colorClasses = {
                                primary: 'bg-primary-100 text-primary-600',
                                success: 'bg-success-100 text-success-600',
                                warning: 'bg-warning-100 text-warning-600',
                            };
                            
                            return (
                                <Card 
                                    key={index} 
                                    variant="hover" 
                                    className="group animate-slide-up border-0 shadow-medium hover:shadow-large"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <CardHeader>
                                        <div className={`w-14 h-14 rounded-2xl ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white relative overflow-hidden">
                {/* Simple dot pattern background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }} />
                </div>
                
                <div className="container-fluid relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                            Ready to transform your learning journey?
                        </h2>
                        <p className="text-xl text-primary-100 mb-10 leading-relaxed">
                            Join thousands of successful students who have achieved their dreams with our AI-powered coaching platform.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button
                                size="xl"
                                variant="secondary"
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-50"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                size="xl"
                                variant="ghost"
                                className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
                            >
                                Schedule Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 text-white py-16">
                <div className="container-fluid">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-3 mb-6 md:mb-0">
                            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold">CoachingPlatform</span>
                        </div>
                        <div className="text-neutral-400 text-sm">
                            © 2024 CoachingPlatform. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
