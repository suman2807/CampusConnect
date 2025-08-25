import { useState } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const InterestedUsersList = ({ 
  request, 
  isOpen, 
  onClose, 
  onAcceptUser, 
  onRejectUser
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  if (!isOpen || !request) return null;

  const interestedUsers = request.interestedUsers || [];

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    selectedUsers.forEach(userId => {
      if (action === 'accept' && onAcceptUser) {
        onAcceptUser(request._id, userId);
      } else if (action === 'reject' && onRejectUser) {
        onRejectUser(request._id, userId);
      }
    });
    setSelectedUsers([]);
  };

  const getFilteredUsers = () => {
    if (filter === 'all') return interestedUsers;
    return interestedUsers.filter(user => {
      const status = user.status || 'pending';
      return status === filter;
    });
  };

  const filteredUsers = getFilteredUsers();

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Interested Users</h2>
              <p className="text-blue-100">
                Request: <span className="font-semibold">{request.title}</span>
              </p>
              <p className="text-blue-100 text-sm">
                {interestedUsers.length} {interestedUsers.length === 1 ? 'user' : 'users'} interested
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users ({interestedUsers.length})</option>
                <option value="pending">Pending ({interestedUsers.filter(u => (u.status || 'pending') === 'pending').length})</option>
                <option value="accepted">Accepted ({interestedUsers.filter(u => u.status === 'accepted').length})</option>
                <option value="rejected">Rejected ({interestedUsers.filter(u => u.status === 'rejected').length})</option>
              </select>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('accept')}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                >
                  Accept Selected
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Reject Selected
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-96 p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <PersonIcon className="text-gray-300 text-6xl mb-4" />
              <p className="text-gray-500 text-lg">
                {filter === 'all' 
                  ? 'No users have shown interest in this request yet.' 
                  : `No ${filter} users found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.clerkId || index}
                  className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                    selectedUsers.includes(user.clerkId) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.clerkId)}
                        onChange={() => handleSelectUser(user.clerkId)}
                        className="mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />

                      {/* User Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.fullName} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <PersonIcon className="text-white text-xl" />
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.fullName || 'Unknown User'}
                          </h3>
                          {getStatusBadge(user.status || 'pending')}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <EmailIcon className="text-gray-400 text-sm" />
                            <span>{user.email}</span>
                          </div>
                          


                          <div className="flex items-center space-x-2">
                            <AccessTimeIcon className="text-gray-400 text-sm" />
                            <span>Applied: {formatJoinDate(user.joinedAt || user.createdAt)}</span>
                          </div>

                          {user.message && (
                            <div className="mt-2 p-2 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-700">
                                <strong>Message:</strong> {user.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {(user.status || 'pending') === 'pending' && (
                        <>
                          <button
                            onClick={() => onAcceptUser && onAcceptUser(request._id, user.clerkId)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm flex items-center space-x-1"
                          >
                            <CheckCircleIcon className="text-sm" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => onRejectUser && onRejectUser(request._id, user.clerkId)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm flex items-center space-x-1"
                          >
                            <CancelIcon className="text-sm" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredUsers.length} of {interestedUsers.length} users shown
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

InterestedUsersList.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    interestedUsers: PropTypes.array
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAcceptUser: PropTypes.func,
  onRejectUser: PropTypes.func
};

InterestedUsersList.defaultProps = {
  request: null,
  onAcceptUser: null,
  onRejectUser: null
};

export default InterestedUsersList;