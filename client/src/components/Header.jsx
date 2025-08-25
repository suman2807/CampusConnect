import { useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import NotificationSystem from './NotificationSystem';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import FeedbackIcon from '@mui/icons-material/Feedback';

const Header = ({ requests = [], onRequestsUpdate, lastUpdateTime }) => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: <HomeIcon /> },
    { name: 'Active Requests', href: '/requests', icon: <ListIcon /> },
    { name: 'Profile', href: '/profile', icon: <PersonIcon /> },
    { name: 'About', href: '/about', icon: <InfoIcon /> },
    { name: 'Feedback', href: '/feedback', icon: <FeedbackIcon /> },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  if (!isSignedIn) {
    return null; // Don't show header if user is not signed in
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Campus Connect</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrentPath(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side - User info and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationSystem 
              requests={requests}
              onRequestsUpdate={onRequestsUpdate}
              lastUpdateTime={lastUpdateTime}
            />

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.fullName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <PersonIcon className="text-white text-sm" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center p-2 text-xs ${
                isCurrentPath(item.href)
                  ? 'text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;