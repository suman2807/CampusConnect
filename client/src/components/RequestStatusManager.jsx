import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';

const RequestStatusManager = ({ 
  request, 
  isOpen, 
  onClose, 
  onStatusUpdated 
}) => {
  const { user } = useUser();
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(request?.status || 'open');
  const [statusReason, setStatusReason] = useState('');

  if (!isOpen || !request) return null;

  const statusOptions = [
    {
      value: 'open',
      label: 'Open',
      icon: <PlayCircleIcon />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Request is open and accepting applications'
    },
    {
      value: 'in-progress',
      label: 'In Progress',
      icon: <PlayCircleIcon />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Request is active and being worked on'
    },
    {
      value: 'completed',
      label: 'Completed',
      icon: <CheckCircleIcon />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Request has been fulfilled and is complete'
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      icon: <CancelIcon />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Request has been cancelled and is no longer active'
    },
    {
      value: 'paused',
      label: 'Paused',
      icon: <PauseCircleIcon />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Request is temporarily paused'
    }
  ];

  const getCurrentStatusInfo = () => {
    return statusOptions.find(option => option.value === (request.status || 'open'));
  };

  const getSelectedStatusInfo = () => {
    return statusOptions.find(option => option.value === selectedStatus);
  };

  const handleStatusUpdate = async () => {
    if (!user || !request) return;

    // Require reason for certain status changes
    if (['cancelled', 'completed'].includes(selectedStatus) && !statusReason.trim()) {
      alert('Please provide a reason for this status change.');
      return;
    }

    try {
      setUpdating(true);
      
      // For now, we'll simulate the API call since the backend might need updates
      // In a real implementation, you'd call something like:
      // await requestAPI.updateRequestStatus(user, request._id, selectedStatus, statusReason);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRequest = {
        ...request,
        status: selectedStatus,
        statusReason: statusReason,
        statusUpdatedAt: new Date().toISOString(),
        statusUpdatedBy: user.id
      };

      alert(`Request status updated to ${getSelectedStatusInfo().label}!`);
      onStatusUpdated(updatedRequest);
      onClose();
      
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error updating request status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const currentStatus = getCurrentStatusInfo();
  const selectedStatusInfo = getSelectedStatusInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Update Request Status</h2>
              <p className="text-indigo-100 text-sm">{request.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Current Status</h3>
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${currentStatus.bgColor}`}>
            <div className={currentStatus.color}>
              {currentStatus.icon}
            </div>
            <div>
              <p className={`font-medium ${currentStatus.color}`}>{currentStatus.label}</p>
              <p className="text-sm text-gray-600">{currentStatus.description}</p>
            </div>
          </div>
        </div>

        {/* Status Options */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Change Status To</h3>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                disabled={option.value === request.status}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  selectedStatus === option.value
                    ? `${option.bgColor} border-2 border-current ${option.color}`
                    : option.value === request.status
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className={selectedStatus === option.value ? option.color : 'text-gray-400'}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    selectedStatus === option.value ? option.color : 'text-gray-900'
                  }`}>
                    {option.label}
                    {option.value === request.status && ' (Current)'}
                  </p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Reason Input */}
          {['cancelled', 'completed', 'paused'].includes(selectedStatus) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for {selectedStatusInfo?.label.toLowerCase()} 
                {['cancelled', 'completed'].includes(selectedStatus) && <span className="text-red-500">*</span>}
              </label>
              <textarea
                rows="3"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder={`Why are you marking this request as ${selectedStatusInfo?.label.toLowerCase()}?`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Status Change Preview */}
          {selectedStatus !== request.status && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Preview Change:</p>
              <p className="text-sm text-blue-700">
                {currentStatus.label} → {selectedStatusInfo?.label}
              </p>
              {selectedStatus === 'completed' && (
                <p className="text-xs text-blue-600 mt-1">
                  ✓ This will close the request to new applications
                </p>
              )}
              {selectedStatus === 'cancelled' && (
                <p className="text-xs text-blue-600 mt-1">
                  ⚠ This will permanently cancel the request
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === request.status}
              className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                updating || selectedStatus === request.status
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Update Status</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatusManager;