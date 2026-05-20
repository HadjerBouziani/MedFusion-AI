import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Activity,
  Trash2,
  CheckCheck,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'update',
    title: 'New Model Available',
    message: 'Chest X-Ray model updated to v2.1 with improved accuracy (97.87%)',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Diagnosis Complete',
    message: 'Case #C-245 analysis completed successfully',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Federated Round Complete',
    message: '12 hospitals participated in the latest training round',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Model Performance Alert',
    message: 'Skin Lesion model accuracy dropped to 94.1% - review recommended',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'success',
    title: 'Report Generated',
    message: 'PDF report for patient John Doe has been generated',
    time: '3 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on May 25, 2026 from 2:00 AM - 4:00 AM',
    time: '4 days ago',
    read: true,
  },
];

export function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'update':
        return <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'update':
        return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800';
    }
  };

  const getCardStyles = (notification: Notification) => {
    if (notification.read) {
      return 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700';
    }
    return 'bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700 shadow-md';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {unreadCount > 0 ? (
              <>
                You have <span className="font-semibold text-blue-600 dark:text-blue-400">{unreadCount}</span> unread
                notification{unreadCount > 1 ? 's' : ''}
              </>
            ) : (
              'All caught up!'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-gray-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-2 transition-all duration-300 hover:shadow-lg ${getCardStyles(notification)}`}
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{notification.title}</h3>
                    {!notification.read && (
                      <Badge className="bg-blue-500 dark:bg-blue-600 text-white border-0 flex-shrink-0">New</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-gray-500 dark:text-gray-500">{notification.time}</span>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardContent className="pt-16 pb-16 text-center">
            <Bell className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-600 dark:text-gray-400">You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}