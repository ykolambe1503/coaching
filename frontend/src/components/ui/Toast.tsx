import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorClasses = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-error-50 border-error-200 text-error-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  };

  const iconColorClasses = {
    success: 'text-success-600',
    error: 'text-error-600',
    warning: 'text-warning-600',
    info: 'text-primary-600',
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl border shadow-medium backdrop-blur-sm transition-all duration-300 max-w-md',
        colorClasses[type],
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isLeaving && '-translate-x-full opacity-0'
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColorClasses[type])} />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        {description && (
          <p className="text-sm opacity-90 mt-1">{description}</p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
  }>>([]);

  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'success', title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'error', title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'warning', title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'info', title, description, duration }),
  };

  return {
    toasts,
    toast,
    removeToast,
  };
};