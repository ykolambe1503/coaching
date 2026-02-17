import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  active?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, className }) => {
  return (
    <nav className={cn('space-y-2', className)}>
      {items.map((item) => {
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group',
              item.active
                ? 'bg-primary-600/10 text-primary-600 shadow-soft'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className={cn(
              'w-5 h-5 transition-transform',
              item.active ? 'text-primary-600' : 'group-hover:scale-110'
            )} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-bold',
                item.active
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-700 text-neutral-300'
              )}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

interface SidebarProps {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  navigation: NavigationItem[];
  footer?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  title,
  subtitle,
  logo,
  navigation,
  footer,
  className,
}) => {
  return (
    <aside className={cn(
      'flex flex-col h-full bg-neutral-900 text-white',
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          {logo}
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-neutral-400">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <Navigation items={navigation} />
      </div>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-neutral-800">
          {footer}
        </div>
      )}
    </aside>
  );
};