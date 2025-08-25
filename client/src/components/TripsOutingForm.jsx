import { useState } from "react";
import PropTypes from 'prop-types';
import { useUser } from "@clerk/clerk-react";
import { requestAPI } from "../api";
import CloseIcon from '@mui/icons-material/Close';
import FlightIcon from '@mui/icons-material/Flight';
import SaveIcon from '@mui/icons-material/Save';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const TripsOutingForm = ({ closeForm, refreshRequests }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    date: "",
    participants: "",
    estimatedCost: "",
    duration: "",
    transportation: "",
    accommodation: "",
    activities: "",
    meetingPoint: "",
    contactInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isSignedIn, user } = useUser();

  const transportationOptions = [
    "Private Car", "Bus", "Train", "Flight", "Shared Cab", "Public Transport", "Other"
  ];

  const accommodationOptions = [
    "Hotel", "Hostel", "Guesthouse", "Homestay", "Camping", "Day Trip (No Stay)", "Other"
  ];

  const durationOptions = [
    "Half Day", "Full Day", "2 Days", "3 Days", "1 Week", "2 Weeks", "Custom"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.participants || formData.participants < 1) {
      newErrors.participants = "Valid number of participants is required";
    }
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.transportation) newErrors.transportation = "Transportation method is required";
    if (!formData.meetingPoint.trim()) newErrors.meetingPoint = "Meeting point is required";
    
    // Check if date is not in the past
    const selectedDate = new Date(formData.date);
    if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
      newErrors.date = "Date must be in the future";
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
        type: "trips",
        title: formData.title.trim(),
        description: formData.description.trim(),
        destination: formData.destination.trim(),
        date: new Date(formData.date),
        participants: Number(formData.participants),
        estimatedCost: formData.estimatedCost.trim(),
        duration: formData.duration,
        transportation: formData.transportation,
        accommodation: formData.accommodation,
        activities: formData.activities.trim(),
        meetingPoint: formData.meetingPoint.trim(),
        contactInfo: formData.contactInfo.trim()
      };

      await requestAPI.createRequest(userData, requestData);
      
      // Refresh the requests list
      if (refreshRequests) {
        await refreshRequests();
      }
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Trip/Outing request created successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      closeForm();
    } catch (error) {
      console.error("Error creating trip/outing request:", error);
      
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FlightIcon className="text-3xl" />
              <h2 className="text-2xl font-bold">Plan Trip/Outing</h2>
            </div>
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors p-1"
              disabled={loading}
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">Organize an amazing trip and find travel companions</p>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Weekend Trip to Goa Beach"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
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
                placeholder="Describe the trip, what to expect, itinerary highlights..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Destination and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LocationOnIcon className="inline mr-1" fontSize="small" />
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Goa, Manali, Dubai"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.destination ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
              </div>

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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
            </div>

            {/* Participants and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GroupIcon className="inline mr-1" fontSize="small" />
                  Participants <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  placeholder="e.g., 5"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.participants ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.participants && <p className="text-red-500 text-sm mt-1">{errors.participants}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.duration ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Duration</option>
                  {durationOptions.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>
            </div>

            {/* Transportation and Accommodation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transportation <span className="text-red-500">*</span>
                </label>
                <select
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.transportation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Transportation</option>
                  {transportationOptions.map(transport => (
                    <option key={transport} value={transport}>{transport}</option>
                  ))}
                </select>
                {errors.transportation && <p className="text-red-500 text-sm mt-1">{errors.transportation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation
                </label>
                <select
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select Accommodation</option>
                  {accommodationOptions.map(accommodation => (
                    <option key={accommodation} value={accommodation}>{accommodation}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AttachMoneyIcon className="inline mr-1" fontSize="small" />
                Estimated Cost (per person)
              </label>
              <input
                type="text"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                placeholder="e.g., ₹5000, $200, Free"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Meeting Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Point <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="meetingPoint"
                value={formData.meetingPoint}
                onChange={handleInputChange}
                placeholder="e.g., Campus Main Gate, City Center"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.meetingPoint ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.meetingPoint && <p className="text-red-500 text-sm mt-1">{errors.meetingPoint}</p>}
            </div>

            {/* Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planned Activities
              </label>
              <textarea
                name="activities"
                value={formData.activities}
                onChange={handleInputChange}
                rows="3"
                placeholder="Beach activities, sightseeing, adventure sports, food tours..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
                disabled={loading}
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="WhatsApp group link, phone number, email..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
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
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Plan Trip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TripsOutingForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
  refreshRequests: PropTypes.func
};

TripsOutingForm.defaultProps = {
  refreshRequests: null
};

export default TripsOutingForm;
