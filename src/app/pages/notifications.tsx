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
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      case 'update':
        return <Activity className="w-6 h-6 text-purple-600" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'update':
        return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? (
              <>
                You have <span className="font-semibold text-blue-600">{unreadCount}</span> unread
                notification{unreadCount > 1 ? 's' : ''}
              </>
            ) : (
              'All caught up!'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700">
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
            className={`border-2 transition-all duration-300 hover:shadow-lg ${
              notification.read ? 'bg-white/50 border-gray-200' : 'bg-white border-blue-300 shadow-md'
            }`}
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{notification.title}</h3>
                    {!notification.read && (
                      <Badge className="bg-blue-500 text-white border-0 flex-shrink-0">New</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{notification.time}</span>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-600 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="pt-16 pb-16 text-center">
            <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
