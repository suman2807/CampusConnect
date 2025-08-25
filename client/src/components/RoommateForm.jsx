import { useState } from "react";
import PropTypes from 'prop-types';
import { useUser } from "@clerk/clerk-react";
import { requestAPI } from "../api";
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@mui/icons-material/Save';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const RoommateForm = ({ closeForm, refreshRequests }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    preferredGender: "",
    location: "",
    moveInDate: "",
    budget: "",
    roomType: "",
    amenities: "",
    lifestyle: "",
    preferences: "",
    occupation: "",
    ageRange: "",
    contactInfo: "",
    additionalInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isSignedIn, user } = useUser();

  const genderOptions = [
    "Male", "Female", "Any", "Non-binary", "Prefer not to say"
  ];

  const roomTypes = [
    "Single Room", "Shared Room", "Studio Apartment", "1BHK", "2BHK", "3BHK", "PG/Hostel"
  ];

  const lifestyleOptions = [
    "Early Bird", "Night Owl", "Social", "Quiet", "Party Lover", "Homebody", "Fitness Enthusiast"
  ];

  const occupationOptions = [
    "Student", "Working Professional", "Freelancer", "Entrepreneur", "Researcher", "Other"
  ];

  const ageRanges = [
    "18-20", "21-23", "24-26", "27-30", "30+", "Age not important"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.preferredGender) newErrors.preferredGender = "Gender preference is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.moveInDate) newErrors.moveInDate = "Move-in date is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget information is required";
    if (!formData.roomType) newErrors.roomType = "Room type is required";
    if (!formData.preferences.trim()) newErrors.preferences = "Preferences are required";
    
    // Check if move-in date is not in the past
    const selectedDate = new Date(formData.moveInDate);
    const today = new Date();
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      newErrors.moveInDate = "Move-in date cannot be in the past";
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
        type: "roommate",
        title: formData.title.trim(),
        description: formData.description.trim(),
        preferredGender: formData.preferredGender,
        location: formData.location.trim(),
        moveInDate: formData.moveInDate,
        budget: formData.budget.trim(),
        roomType: formData.roomType,
        amenities: formData.amenities.trim(),
        lifestyle: formData.lifestyle,
        preferences: formData.preferences.trim(),
        occupation: formData.occupation,
        ageRange: formData.ageRange,
        contactInfo: formData.contactInfo.trim(),
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
      notification.textContent = 'Roommate request created successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      closeForm();
    } catch (error) {
      console.error("Error creating roommate request:", error);
      
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
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HomeIcon className="text-3xl" />
              <h2 className="text-2xl font-bold">Find Roommate</h2>
            </div>
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors p-1"
              disabled={loading}
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
          <p className="text-red-100 mt-2">Find the perfect roommate for your accommodation needs</p>
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
                placeholder="e.g., Looking for Female Roommate in Gachibowli"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
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
                rows="4"
                placeholder="Describe yourself, your housing situation, and what you're looking for in a roommate..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Gender Preference and Age Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PersonIcon className="inline mr-1" fontSize="small" />
                  Gender Preference <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferredGender"
                  value={formData.preferredGender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.preferredGender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Preference</option>
                  {genderOptions.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
                {errors.preferredGender && <p className="text-red-500 text-sm mt-1">{errors.preferredGender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select Age Range</option>
                  {ageRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location and Move-in Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LocationOnIcon className="inline mr-1" fontSize="small" />
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Gachibowli, Madhapur, Kukatpally"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AccessTimeIcon className="inline mr-1" fontSize="small" />
                  Move-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.moveInDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.moveInDate && <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>}
              </div>
            </div>

            {/* Budget and Room Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AttachMoneyIcon className="inline mr-1" fontSize="small" />
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹10,000/month, ₹5000-8000"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.roomType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
              </div>
            </div>

            {/* Occupation and Lifestyle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select Occupation</option>
                  {occupationOptions.map(occupation => (
                    <option key={occupation} value={occupation}>{occupation}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lifestyle
                </label>
                <select
                  name="lifestyle"
                  value={formData.lifestyle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select Lifestyle</option>
                  {lifestyleOptions.map(lifestyle => (
                    <option key={lifestyle} value={lifestyle}>{lifestyle}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Amenities
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="e.g., WiFi, AC, Washing Machine, Gym, Parking"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                disabled={loading}
              />
              <p className="text-gray-500 text-sm mt-1">Separate amenities with commas</p>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roommate Preferences <span className="text-red-500">*</span>
              </label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleInputChange}
                rows="3"
                placeholder="What qualities are you looking for in a roommate? Habits, cleanliness, study preferences, etc..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors resize-none ${
                  errors.preferences ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.preferences && <p className="text-red-500 text-sm mt-1">{errors.preferences}</p>}
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ContactPhoneIcon className="inline mr-1" fontSize="small" />
                Contact Information
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Phone number, WhatsApp, email, or preferred contact method"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                disabled={loading}
              />
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
                placeholder="Any other details, house rules, special requirements, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors resize-none"
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
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Find Roommate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RoommateForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
  refreshRequests: PropTypes.func
};

RoommateForm.defaultProps = {
  refreshRequests: null
};

export default RoommateForm;
