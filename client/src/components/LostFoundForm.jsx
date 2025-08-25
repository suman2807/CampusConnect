import { useState } from "react";
import PropTypes from 'prop-types';
import { useUser } from "@clerk/clerk-react";
import { requestAPI } from "../api";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const LostFoundForm = ({ closeForm, refreshRequests }) => {
  const [formData, setFormData] = useState({
    title: "",
    itemName: "",
    itemDescription: "",
    lostOrFound: "",
    locationLostFound: "",
    dateLostFound: "",
    timeApproximate: "",
    category: "",
    color: "",
    brand: "",
    additionalDetails: "",
    contactInfo: "",
    rewardOffered: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isSignedIn, user } = useUser();

  const itemCategories = [
    "Electronics", "Jewelry", "Clothing", "Books/Stationery", "Sports Equipment",
    "Personal Items", "Bags/Wallets", "Keys", "Documents", "Other"
  ];

  const locationOptions = [
    "Library", "Cafeteria", "Sports Ground", "Lecture Hall", "Laboratory",
    "Hostel", "Parking Area", "Garden/Campus", "Administrative Block", "Other"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required";
    if (!formData.itemDescription.trim()) newErrors.itemDescription = "Item description is required";
    if (!formData.lostOrFound) newErrors.lostOrFound = "Please specify if item was lost or found";
    if (!formData.locationLostFound.trim()) newErrors.locationLostFound = "Location is required";
    if (!formData.dateLostFound) newErrors.dateLostFound = "Date is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    // Check if date is not in the future (for lost items)
    const selectedDate = new Date(formData.dateLostFound);
    const today = new Date();
    if (selectedDate > today) {
      newErrors.dateLostFound = "Date cannot be in the future";
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
        type: "lost-found",
        title: formData.title.trim(),
        itemName: formData.itemName.trim(),
        itemDescription: formData.itemDescription.trim(),
        lostOrFound: formData.lostOrFound,
        locationLostFound: formData.locationLostFound.trim(),
        dateLostFound: formData.dateLostFound,
        timeApproximate: formData.timeApproximate,
        category: formData.category,
        color: formData.color.trim(),
        brand: formData.brand.trim(),
        additionalDetails: formData.additionalDetails.trim(),
        contactInfo: formData.contactInfo.trim(),
        rewardOffered: formData.rewardOffered.trim()
      };

      await requestAPI.createRequest(userData, requestData);
      
      // Refresh the requests list
      if (refreshRequests) {
        await refreshRequests();
      }
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Lost & Found request created successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      closeForm();
    } catch (error) {
      console.error("Error creating lost & found request:", error);
      
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
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SearchIcon className="text-3xl" />
              <h2 className="text-2xl font-bold">Lost & Found</h2>
            </div>
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors p-1"
              disabled={loading}
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
          <p className="text-orange-100 mt-2">Report a lost item or help someone find their belongings</p>
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
                placeholder="e.g., Lost iPhone 13 in Library"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Lost or Found */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="lostOrFound"
                    value="Lost"
                    checked={formData.lostOrFound === "Lost"}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-red-600 font-medium">I Lost Something</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="lostOrFound"
                    value="Found"
                    checked={formData.lostOrFound === "Found"}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-green-600 font-medium">I Found Something</span>
                </label>
              </div>
              {errors.lostOrFound && <p className="text-red-500 text-sm mt-1">{errors.lostOrFound}</p>}
            </div>

            {/* Item Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone 13, Blue Notebook"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.itemName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.itemName && <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CategoryIcon className="inline mr-1" fontSize="small" />
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {itemCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Item Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                rows="3"
                placeholder="Detailed description of the item, distinguishing features, etc..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors resize-none ${
                  errors.itemDescription ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.itemDescription && <p className="text-red-500 text-sm mt-1">{errors.itemDescription}</p>}
            </div>

            {/* Color and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Black, Blue, Red"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand/Make
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Apple, Samsung, Nike"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LocationOnIcon className="inline mr-1" fontSize="small" />
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="locationLostFound"
                  value={formData.locationLostFound}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.locationLostFound ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Location</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.locationLostFound && <p className="text-red-500 text-sm mt-1">{errors.locationLostFound}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AccessTimeIcon className="inline mr-1" fontSize="small" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateLostFound"
                  value={formData.dateLostFound}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.dateLostFound ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.dateLostFound && <p className="text-red-500 text-sm mt-1">{errors.dateLostFound}</p>}
              </div>
            </div>

            {/* Approximate Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approximate Time
              </label>
              <input
                type="time"
                name="timeApproximate"
                value={formData.timeApproximate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Contact Information */}
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
                placeholder="Phone number, email, or preferred contact method"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Reward Offered (for lost items) */}
            {formData.lostOrFound === "Lost" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Offered
                </label>
                <input
                  type="text"
                  name="rewardOffered"
                  value={formData.rewardOffered}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹500, Free Lunch, No reward"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  disabled={loading}
                />
              </div>
            )}

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                rows="2"
                placeholder="Any other important information, circumstances, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors resize-none"
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
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Post {formData.lostOrFound || 'Item'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LostFoundForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
  refreshRequests: PropTypes.func
};

LostFoundForm.defaultProps = {
  refreshRequests: null
};

export default LostFoundForm;
