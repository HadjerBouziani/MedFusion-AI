import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Bell,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Brain,
  Clock,
  TrendingUp,
  X
} from 'lucide-react';
import { useState } from 'react';

type NotificationType = 'success' | 'warning' | 'info' | 'deadline';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionable?: boolean;
  actionLabel?: string;
  actionLink?: string;
}

export function AITeamNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'info',
      title: 'New Global Model Available',
      message: 'CXR-RN18-v2.2 is ready for download. Round 16 training starts soon.',
      timestamp: '1 hour ago',
      isRead: false,
      actionable: true,
      actionLabel: 'Download Now',
      actionLink: '/ai/training'
    },
    {
      id: 2,
      type: 'success',
      title: 'Upload Successfully Aggregated',
      message: 'Your Brain MRI model update has been successfully aggregated into the global model.',
      timestamp: '3 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Training Deadline Approaching',
      message: 'Skin Lesion HAM10000 model training deadline in 2 days. Please upload your update.',
      timestamp: '5 hours ago',
      isRead: true,
      actionable: true,
      actionLabel: 'Upload Update',
      actionLink: '/ai/training'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Validation Warning',
      message: 'Your previous upload had a minor integrity warning but was accepted.',
      timestamp: '1 day ago',
      isRead: true
    },
    {
      id: 5,
      type: 'success',
      title: 'Contribution Weight Increased',
      message: 'Your contribution weight for Retinal OCT increased from 0.18 to 0.21.',
      timestamp: '1 day ago',
      isRead: true
    },
    {
      id: 6,
      type: 'info',
      title: 'Round 15 Aggregation Complete',
      message: 'Global accuracy improved from 96.2% to 97.0%. Great work!',
      timestamp: '2 days ago',
      isRead: true
    },
    {
      id: 7,
      type: 'info',
      title: 'SSL Quality Improvement Detected',
      message: 'Your representation quality for Chest X-Ray improved by 12%.',
      timestamp: '3 days ago',
      isRead: true
    },
  ]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
      case 'deadline':
        return 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-white/20 text-white border-0">
              <Bell className="w-3 h-3 mr-1" />
              {unreadCount} Unread
            </Badge>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-white hover:bg-white/20"
              >
                Mark all as read
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Notifications
          </h1>
          <p className="text-purple-100 text-lg">
            Stay updated on your federated learning activities
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up! Check back later for updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                !notification.isRead ? 'ring-2 ring-purple-500/20' : ''
              }`}
            >
              <div
                className={`h-1 bg-gradient-to-r ${
                  notification.type === 'success' ? 'from-green-500 to-emerald-600' :
                  notification.type === 'warning' ? 'from-amber-500 to-orange-600' :
                  notification.type === 'deadline' ? 'from-orange-500 to-red-600' :
                  'from-blue-500 to-indigo-600'
                }`}
              ></div>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getNotificationColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0 border`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {notification.timestamp}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      </button>
                    </div>
                    {notification.actionable && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                        >
                          {notification.actionLabel}
                        </Button>
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
