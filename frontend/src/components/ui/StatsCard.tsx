import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'primary',
  className,
}) => {
  const colorClasses = {
    primary: {
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      gradient: 'from-primary-500 to-primary-600',
    },
    success: {
      iconBg: 'bg-success-50',
      iconColor: 'text-success-600',
      gradient: 'from-success-500 to-success-600',
    },
    warning: {
      iconBg: 'bg-warning-50',
      iconColor: 'text-warning-600',
      gradient: 'from-warning-500 to-warning-600',
    },
    error: {
      iconBg: 'bg-error-50',
      iconColor: 'text-error-600',
      gradient: 'from-error-500 to-error-600',
    },
    neutral: {
      iconBg: 'bg-neutral-50',
      iconColor: 'text-neutral-600',
      gradient: 'from-neutral-500 to-neutral-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <Card variant="hover" className={cn('group relative overflow-hidden', className)}>
      {/* Background Gradient */}
      <div className={cn(
        'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10',
        colors.gradient
      )} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'p-3 rounded-2xl transition-transform group-hover:scale-110',
            colors.iconBg
          )}>
            <Icon className={cn('w-6 h-6', colors.iconColor)} />
          </div>
          
          {trend && (
            <Badge
              variant={trend.direction === 'up' ? 'success' : 'error'}
              className="flex items-center gap-1"
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}%
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
            {value}
          </p>
          {description && (
            <p className="text-sm text-neutral-600">{description}</p>
          )}
          {trend && (
            <p className="text-xs text-neutral-500 mt-2">{trend.label}</p>
          )}
        </div>
      </div>
    </Card>
  );
};