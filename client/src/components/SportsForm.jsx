import { useState } from "react";
import PropTypes from 'prop-types';
import { useUser } from "@clerk/clerk-react";
import { requestAPI } from "../api";
import CloseIcon from '@mui/icons-material/Close';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SaveIcon from '@mui/icons-material/Save';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';

const SportsForm = ({ closeForm, refreshRequests }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sportName: "",
    teamSize: "",
    date: "",
    time: "",
    venue: "",
    skillLevel: "",
    additionalInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isSignedIn, user } = useUser();

  const sportOptions = [
    "Football", "Basketball", "Cricket", "Tennis", "Badminton", 
    "Volleyball", "Table Tennis", "Swimming", "Athletics", "Chess", "Other"
  ];

  const skillLevels = [
    "Beginner", "Intermediate", "Advanced", "Professional", "Any Level"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.sportName) newErrors.sportName = "Sport type is required";
    if (!formData.teamSize || formData.teamSize < 1) newErrors.teamSize = "Valid team size is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.skillLevel) newErrors.skillLevel = "Skill level is required";
    
    // Check if date is not in the past
    const selectedDate = new Date(formData.date + 'T' + formData.time);
    if (selectedDate < new Date()) {
      newErrors.date = "Date and time must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!isSignedIn || !user) {
      alert("Please sign in to create a request.");
      return;
    }

    try {
      setLoading(true);
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName
      };

      const requestData = {
        type: "sports",
        title: formData.title.trim(),
        description: formData.description.trim(),
        sportName: formData.sportName,
        teamSize: parseInt(formData.teamSize),
        date: formData.date,
        time: formData.time,
        venue: formData.venue.trim(),
        skillLevel: formData.skillLevel,
        additionalInfo: formData.additionalInfo.trim()
      };

      await requestAPI.createRequest(userData, requestData);
      
      // Refresh the requests list
      if (refreshRequests) {
        await refreshRequests();
      }
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Sports request created successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      closeForm();
    } catch (error) {
      console.error("Error creating sports request:", error);
      
      // Error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Error creating request. Please try again.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SportsSoccerIcon className="text-3xl" />
              <h2 className="text-2xl font-bold">Create Sports Request</h2>
            </div>
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors p-1"
              disabled={loading}
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">Organize a sports activity and find teammates</p>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Evening Football Match"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe the sports activity, rules, and what participants should expect..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Sport Type and Team Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="sportName"
                  value={formData.sportName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.sportName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Sport</option>
                  {sportOptions.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
                {errors.sportName && <p className="text-red-500 text-sm mt-1">{errors.sportName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GroupIcon className="inline mr-1" fontSize="small" />
                  Team Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  placeholder="e.g., 10"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.teamSize ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.teamSize && <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AccessTimeIcon className="inline mr-1" fontSize="small" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <LocationOnIcon className="inline mr-1" fontSize="small" />
                Venue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="e.g., Main Sports Ground, Basketball Court A"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.venue ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level <span className="text-red-500">*</span>
              </label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.skillLevel ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select Skill Level</option>
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.skillLevel && <p className="text-red-500 text-sm mt-1">{errors.skillLevel}</p>}
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows="2"
                placeholder="Any additional details, equipment needed, cost, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                disabled={loading}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeForm}
              disabled={loading}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Create Sports Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SportsForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
  refreshRequests: PropTypes.func
};

SportsForm.defaultProps = {
  refreshRequests: null
};

export default SportsForm;
