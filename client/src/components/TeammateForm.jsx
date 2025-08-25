import { useState } from "react";
import PropTypes from 'prop-types';
import { useUser } from "@clerk/clerk-react";
import { requestAPI } from "../api";
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const TeammateForm = ({ closeForm, refreshRequests }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirement: "",
    teammateType: "",
    additionalInfo: "",
    skillsRequired: "",
    timeCommitment: "",
    projectDuration: "",
    preferredTeamSize: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isSignedIn, user } = useUser();

  const teammateTypes = [
    { value: "project", label: "Project Partner", icon: <WorkIcon /> },
    { value: "study", label: "Study Buddy", icon: <SchoolIcon /> },
    { value: "research", label: "Research Partner", icon: <SchoolIcon /> },
    { value: "startup", label: "Startup Co-founder", icon: <WorkIcon /> },
    { value: "hackathon", label: "Hackathon Team", icon: <WorkIcon /> },
    { value: "academic", label: "Academic Collaboration", icon: <SchoolIcon /> },
    { value: "other", label: "Other", icon: <GroupIcon /> }
  ];

  const timeCommitments = [
    "1-5 hours/week", "6-10 hours/week", "11-20 hours/week", 
    "21-30 hours/week", "Full-time", "Flexible"
  ];

  const projectDurations = [
    "1-2 weeks", "1 month", "2-3 months", "6 months", 
    "1 year", "Long-term", "Ongoing"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.requirement.trim()) newErrors.requirement = "Requirements are needed";
    if (!formData.teammateType) newErrors.teammateType = "Teammate type is required";
    if (!formData.timeCommitment) newErrors.timeCommitment = "Time commitment is required";
    if (!formData.projectDuration) newErrors.projectDuration = "Project duration is required";
    if (!formData.preferredTeamSize || formData.preferredTeamSize < 1) {
      newErrors.preferredTeamSize = "Valid team size is required";
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
        type: "teammate",
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirement: formData.requirement.trim(),
        teammateType: formData.teammateType,
        additionalInfo: formData.additionalInfo.trim(),
        skillsRequired: formData.skillsRequired.trim(),
        timeCommitment: formData.timeCommitment,
        projectDuration: formData.projectDuration,
        preferredTeamSize: parseInt(formData.preferredTeamSize)
      };

      await requestAPI.createRequest(userData, requestData);
      
      // Refresh the requests list
      if (refreshRequests) {
        await refreshRequests();
      }
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Teammate request created successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      closeForm();
    } catch (error) {
      console.error("Error creating teammate request:", error);
      
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GroupIcon className="text-3xl" />
              <h2 className="text-2xl font-bold">Find Teammate</h2>
            </div>
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors p-1"
              disabled={loading}
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
          <p className="text-green-100 mt-2">Find the perfect teammate for your project or collaboration</p>
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
                placeholder="e.g., Looking for React Developer for Web App"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe your project, goals, and what you're trying to achieve..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                name="requirement"
                value={formData.requirement}
                onChange={handleInputChange}
                rows="3"
                placeholder="What qualities, skills, or experience are you looking for in a teammate?"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none ${
                  errors.requirement ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.requirement && <p className="text-red-500 text-sm mt-1">{errors.requirement}</p>}
            </div>

            {/* Teammate Type and Team Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collaboration Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="teammateType"
                  value={formData.teammateType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.teammateType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  {teammateTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.teammateType && <p className="text-red-500 text-sm mt-1">{errors.teammateType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Team Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="preferredTeamSize"
                  value={formData.preferredTeamSize}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  placeholder="e.g., 3"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.preferredTeamSize ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.preferredTeamSize && <p className="text-red-500 text-sm mt-1">{errors.preferredTeamSize}</p>}
              </div>
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, React, Node.js, Python, Design"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                disabled={loading}
              />
              <p className="text-gray-500 text-sm mt-1">Separate skills with commas</p>
            </div>

            {/* Time Commitment and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Commitment <span className="text-red-500">*</span>
                </label>
                <select
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.timeCommitment ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Time Commitment</option>
                  {timeCommitments.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Duration <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectDuration"
                  value={formData.projectDuration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.projectDuration ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Duration</option>
                  {projectDurations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
                {errors.projectDuration && <p className="text-red-500 text-sm mt-1">{errors.projectDuration}</p>}
              </div>
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
                rows="3"
                placeholder="Any additional details, meeting preferences, communication tools, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none"
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
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Find Teammate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TeammateForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
  refreshRequests: PropTypes.func
};

TeammateForm.defaultProps = {
  refreshRequests: null
};

export default TeammateForm;
