import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Math.random().toString(36).slice(2);
    const newNotification = {
      id,
      type: notification.type || 'info',
      message: notification.message,
      title: notification.title,
      duration: notification.duration || 5000,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-dismiss after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    return addNotification({ type: 'success', message, title });
  }, [addNotification]);

  const showInfo = useCallback((message, title = 'Info') => {
    return addNotification({ type: 'info', message, title });
  }, [addNotification]);

  const showError = useCallback((message, title = 'Error') => {
    return addNotification({ type: 'error', message, title });
  }, [addNotification]);

  const showWarning = useCallback((message, title = 'Warning') => {
    return addNotification({ type: 'warning', message, title });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        showSuccess,
        showInfo,
        showError,
        showWarning,
      }}
    >
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-md sm:w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  const { type, message, title } = notification;

  const icons = {
    success: CheckCircle2,
    info: Info,
    error: AlertCircle,
    warning: AlertCircle,
  };

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-900',
      icon: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      title: 'text-emerald-800',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: 'text-blue-800',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-900',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      title: 'text-red-800',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-900',
      icon: 'text-amber-600',
      iconBg: 'bg-amber-100',
      title: 'text-amber-800',
    },
  };

  const style = styles[type] || styles.info;
  const Icon = icons[type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'pointer-events-auto rounded-2xl border-2 shadow-lg backdrop-blur-sm',
        style.bg,
        style.text
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={cn('rounded-full p-2 flex-shrink-0', style.iconBg)}>
          <Icon className={cn('h-5 w-5', style.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('font-semibold text-sm mb-1', style.title)}>
              {title}
            </h4>
          )}
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className={cn(
            'flex-shrink-0 rounded-lg p-1.5 hover:bg-black/5 transition-colors',
            style.text
          )}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationProvider;

