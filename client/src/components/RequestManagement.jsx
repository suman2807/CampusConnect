import { useState } from 'react';
import { requestAPI } from '../api';
import { useUser } from '@clerk/clerk-react';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';

const RequestManagement = ({ 
  request, 
  isOpen, 
  onClose, 
  onRequestUpdated, 
  onRequestDeleted 
}) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState(request || {});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  if (!isOpen || !request) return null;

  const handleInputChange = (field, value) => {
    setEditedRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Here you would call an update API endpoint
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Request updated successfully!');
      onRequestUpdated(editedRequest);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error updating request. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setSaving(true);

      // Update request status to completed
      const updatedRequest = { ...request, status: 'completed' };
      
      // Here you would call an update API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Request marked as completed!');
      onRequestUpdated(updatedRequest);
    } catch (error) {
      console.error('Error marking request as complete:', error);
      alert('Error updating request status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      alert('Please provide a reason for deleting this request.');
      return;
    }

    try {
      setDeleting(true);
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName
      };

      await requestAPI.deleteRequest(userData, request._id, deleteReason);
      
      alert('Request deleted successfully!');
      onRequestDeleted(request._id);
      onClose();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderEditForm = () => {
    switch (request.type) {
      case 'sports':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editedRequest.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport Name</label>
              <input
                type="text"
                value={editedRequest.sportName || ''}
                onChange={(e) => handleInputChange('sportName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editedRequest.date ? new Date(editedRequest.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={editedRequest.time || ''}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                value={editedRequest.venue || ''}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <input
                type="number"
                value={editedRequest.teamSize || ''}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'teammate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editedRequest.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={editedRequest.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirement</label>
              <textarea
                rows="3"
                value={editedRequest.requirement || ''}
                onChange={(e) => handleInputChange('requirement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teammate Type</label>
              <select
                value={editedRequest.teammateType || ''}
                onChange={(e) => handleInputChange('teammateType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="project">Project Partner</option>
                <option value="study">Study Buddy</option>
                <option value="research">Research Partner</option>
                <option value="startup">Startup Co-founder</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 'trips':
      case 'outing':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editedRequest.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                value={editedRequest.destination || ''}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={editedRequest.date ? new Date(editedRequest.date).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Participants</label>
              <input
                type="number"
                value={editedRequest.participants || ''}
                onChange={(e) => handleInputChange('participants', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editedRequest.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-red-600 mb-4">Delete Request</h3>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this request? This action cannot be undone.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please provide a reason for deletion:
            </label>
            <textarea
              rows="3"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Reason for deletion..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || !deleteReason.trim()}
              className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2 ${
                deleting || !deleteReason.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <DeleteIcon className="text-sm" />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isEditing ? 'Edit Request' : 'Manage Request'}
              </h2>
              <p className="text-blue-100">
                Request: <span className="font-semibold">{request.title}</span>
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

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isEditing ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Request Details</h3>
              {renderEditForm()}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p><strong>Title:</strong> {request.title}</p>
                <p><strong>Type:</strong> {request.type}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${
                  request.status === 'completed' ? 'bg-green-100 text-green-800' :
                  request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{(request.status || 'open').toUpperCase()}</span></p>
                <p><strong>Created:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                <p><strong>Interested Users:</strong> {request.interestedUsers?.length || 0}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between">
            <div className="flex space-x-3">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <EditIcon className="text-sm" />
                    <span>Edit</span>
                  </button>
                  

                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <DeleteIcon className="text-sm" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${
                      saving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <SaveIcon className="text-sm" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;