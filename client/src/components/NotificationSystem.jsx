import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const NotificationSystem = ({ 
  requests = [], 
  onRequestsUpdate,
  lastUpdateTime 
}) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());

  useEffect(() => {
    checkForNewNotifications();
  }, [requests, lastUpdateTime]);

  const checkForNewNotifications = () => {
    if (!user || !requests.length) return;

    const newNotifications = [];
    const now = Date.now();
    const checkTime = now - 30000; // Check for notifications in the last 30 seconds

    // Check for new applications to user's requests
    const myRequests = requests.filter(req => req.createdBy?.clerkId === user.id);
    
    myRequests.forEach(request => {
      if (request.interestedUsers && request.interestedUsers.length > 0) {
        request.interestedUsers.forEach(interestedUser => {
          const joinTime = new Date(interestedUser.joinedAt || interestedUser.createdAt).getTime();
          if (joinTime > lastChecked && joinTime > checkTime) {
            newNotifications.push({
              id: `${request._id}-${interestedUser.clerkId}-${joinTime}`,
              type: 'new_application',
              title: 'New Application!',
              message: `${interestedUser.fullName || 'Someone'} is interested in your "${request.title}" request`,
              timestamp: joinTime,
              requestId: request._id,
              userId: interestedUser.clerkId,
              read: false
            });
          }
        });
      }
    });

    // Check for new requests in user's categories of interest
    const recentRequests = requests.filter(req => {
      const createdTime = new Date(req.createdAt).getTime();
      return req.createdBy?.clerkId !== user.id && 
             createdTime > lastChecked && 
             createdTime > checkTime;
    });

    recentRequests.forEach(request => {
      newNotifications.push({
        id: `new-request-${request._id}`,
        type: 'new_request',
        title: 'New Request Available!',
        message: `New ${request.type} request: "${request.title}"`,
        timestamp: new Date(request.createdAt).getTime(),
        requestId: request._id,
        read: false
      });
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev.slice(0, 20)]); // Keep only latest 20
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        newNotifications.forEach(notif => {
          new Notification(notif.title, {
            body: notif.message,
            icon: '/favicon.ico',
            tag: notif.id
          });
        });
      }
    }

    setLastChecked(now);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Notifications Enabled!', {
          body: 'You\'ll now receive real-time updates about your requests.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_application':
        return <PersonIcon className="text-blue-500" />;
      case 'new_request':
        return <GroupIcon className="text-green-500" />;
      case 'status_update':
        return <CheckCircleIcon className="text-purple-500" />;
      default:
        return <InfoIcon className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (onRequestsUpdate) {
        onRequestsUpdate();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [onRequestsUpdate]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        {unreadCount > 0 ? (
          <NotificationsActiveIcon className="text-2xl text-blue-500" />
        ) : (
          <NotificationsIcon className="text-2xl" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <NotificationsIcon className="text-4xl text-gray-300 mb-2 mx-auto" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">You&apos;ll be notified when someone shows interest in your requests</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <CloseIcon fontSize="small" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={clearAllNotifications}
                className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-40">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Auto-refreshing...</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;