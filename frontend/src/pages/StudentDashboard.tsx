import React from 'react';
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Calendar, 
  Award, 
  Clock,
  Target,
  Users,
  MessageCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatsCard } from '../components/ui/StatsCard';

const StudentDashboard = () => {
  const stats = [
    {
      title: 'Current Streak',
      value: '12 days',
      icon: Target,
      color: 'success' as const,
      trend: {
        value: 20,
        label: 'vs last month',
        direction: 'up' as const,
      },
    },
    {
      title: 'Tests Completed',
      value: 24,
      icon: CheckCircle2,
      color: 'primary' as const,
      trend: {
        value: 15,
        label: 'vs last month',
        direction: 'up' as const,
      },
    },
    {
      title: 'Average Score',
      value: '85%',
      icon: TrendingUp,
      color: 'warning' as const,
      trend: {
        value: 8,
        label: 'vs last month',
        direction: 'up' as const,
      },
    },
    {
      title: 'Study Hours',
      value: '42h',
      icon: Clock,
      color: 'neutral' as const,
      description: 'This week',
    },
  ];

  const upcomingTests = [
    {
      id: 1,
      title: 'MPSC Prelims Mock Test #5',
      date: '2024-02-20',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'General Studies Practice Test',
      date: '2024-02-22',
      time: '2:00 PM',
      duration: '1.5 hours',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Current Affairs Weekly Quiz',
      date: '2024-02-25',
      time: '11:00 AM',
      duration: '45 minutes',
      status: 'upcoming',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'test_completed',
      title: 'Completed History Mock Test',
      score: 78,
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'success',
    },
    {
      id: 2,
      type: 'doubt_solved',
      title: 'Asked about Indian Constitution',
      time: '5 hours ago',
      icon: MessageCircle,
      color: 'primary',
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achieved 10-day study streak!',
      time: '1 day ago',
      icon: Award,
      color: 'warning',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-40">
        <div className="container-fluid py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                Welcome back, Alex! 👋
              </h1>
              <p className="text-neutral-600 text-lg">
                Ready to continue your MPSC preparation journey?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                icon={<Brain className="w-5 h-5" />}
              >
                Ask AI Tutor
              </Button>
              <Button
                icon={<Play className="w-5 h-5" />}
                className="shadow-glow hover:shadow-glow-lg"
              >
                Start Practice
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-fluid py-8">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <StatsCard {...stat} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Jump into your learning activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="secondary"
                  className="w-full justify-start h-14"
                  icon={<BookOpen className="w-5 h-5" />}
                >
                  <div className="text-left">
                    <div className="font-semibold">Continue Reading</div>
                    <div className="text-sm text-neutral-500">Indian Polity - Chapter 5</div>
                  </div>
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start h-14"
                  icon={<Brain className="w-5 h-5" />}
                >
                  <div className="text-left">
                    <div className="font-semibold">AI Doubt Solver</div>
                    <div className="text-sm text-neutral-500">Get instant answers</div>
                  </div>
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start h-14"
                  icon={<TrendingUp className="w-5 h-5" />}
                >
                  <div className="text-left">
                    <div className="font-semibold">Performance Analytics</div>
                    <div className="text-sm text-neutral-500">Track your progress</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Tests */}
            <Card className="lg:col-span-2 shadow-medium border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-primary-600" />
                      Upcoming Tests
                    </CardTitle>
                    <CardDescription>
                      Your scheduled practice tests and exams
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTests.map((test, index) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-neutral-200/50 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {test.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {test.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {test.time}
                            </span>
                            <Badge variant="neutral" size="sm">
                              {test.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Start Test
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    const colorClasses = {
                      success: 'bg-success-100 text-success-600',
                      primary: 'bg-primary-100 text-primary-600',
                      warning: 'bg-warning-100 text-warning-600',
                    };
                    
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl ${colorClasses[activity.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{activity.title}</p>
                          {activity.score && (
                            <p className="text-sm text-neutral-500">Score: {activity.score}%</p>
                          )}
                          <p className="text-xs text-neutral-400">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Your learning progress this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">General Studies</span>
                      <span className="text-sm font-semibold text-neutral-900">85%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">History</span>
                      <span className="text-sm font-semibold text-neutral-900">78%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-success-600 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Geography</span>
                      <span className="text-sm font-semibold text-neutral-900">92%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-warning-600 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Current Affairs</span>
                      <span className="text-sm font-semibold text-neutral-900">67%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-error-600 h-2 rounded-full" style={{ width: '67%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;