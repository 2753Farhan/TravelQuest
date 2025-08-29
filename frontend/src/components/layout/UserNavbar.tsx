import { Link } from 'react-router-dom';
import { Bars3Icon, BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { respondToInvitation } from '../../api/travelgroup';
import { UserProfileSidebar } from '../../components/User/UserProfileSidebar';
import { createPortal } from 'react-dom';


import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
} from '../../api/notifications';

interface Notification {
  notificationId: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedEntityType: string;
  relatedEntityId: string;
  metadata?: {
    membershipId?: string;
    tripId?: string;
  };
}

export default function UserNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.id]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getUserNotifications(user?.id || '', true);
      setNotifications(data);
      setUnreadCount(data.filter((n: { isRead: any; }) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.notificationId);
        setNotifications(notifications.map(n => 
          n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(unreadCount - 1);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setSelectedNotification(notification);
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return;
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleInvitationResponse = async (action: 'accept' | 'decline') => {
    if (!selectedNotification?.relatedEntityId || !user?.id) {
      console.error('Missing required data for invitation response');
      return;
    }

    try {
      setIsResponding(true);
      
      await respondToInvitation(selectedNotification.relatedEntityId, {
        userId: user.id,
        action
      });

      setNotifications(prev => prev.filter(
        n => n.notificationId !== selectedNotification.notificationId
      ));

      if (!selectedNotification.isRead) {
        setUnreadCount(prev => prev - 1);
      }

      setSelectedNotification(null);
      
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error);
    } finally {
      setIsResponding(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'invitation': return '🎯';
      case 'message': return '💬';
      case 'system': return '⚙️';
      case 'trip_update': return '✈️';
      default: return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40 ">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <img
                src="/logo.png"
                alt="Cefalo Travel Connect Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cefalo Travel Connect
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/places" text="Places" />
            <NavLink to="/transports" text="Transports" />
            <NavLink to="/travel-logs" text="Travel Logs" />
            <NavLink to="/wishlists" text="Wishlists" />
            <NavLink to="/groups" text="Groups" />
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <p className="mt-2">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.notificationId}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                              !notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <span className="text-sm">
                                  {getNotificationIcon(notification.type)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.content}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(notification.createdAt)}
                                  </span>
                                  {!notification.isRead && (
                                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bars3Icon className="h-5 w-5 text-gray-600" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div 
                  className="hidden md:flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-xl transition-colors"
                  onClick={() => setShowProfileSidebar(true)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-lg">
                    {getNotificationIcon(selectedNotification.type)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedNotification.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{selectedNotification.content}</p>
              <p className="text-sm text-gray-500 mt-3 flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
            </div>
            
            {selectedNotification.type === 'invitation' && (
              <div className="flex space-x-3 border-t border-gray-100 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInvitationResponse('decline');
                  }}
                  disabled={isResponding}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isResponding 
                      ? 'bg-gray-100 text-gray-400 border-gray-200' 
                      : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
                  }`}
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>{isResponding ? 'Processing...' : 'Decline'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInvitationResponse('accept');
                  }}
                  disabled={isResponding}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isResponding
                      ? 'bg-gray-100 text-gray-400 border-gray-200'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>{isResponding ? 'Processing...' : 'Accept'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Profile Sidebar */}
{showProfileSidebar && user?.id && createPortal(
  <UserProfileSidebar 
    userId={user.id} 
    onClose={() => setShowProfileSidebar(false)} 
  />,
  document.body
)}
    </nav>
  );
}

const NavLink = ({ to, text }: { to: string; text: string }) => (
  <Link 
    to={to} 
    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium relative group"
  >
    {text}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
  </Link>
);