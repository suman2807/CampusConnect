import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReportIcon from '@mui/icons-material/Report';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const RequestDetailModal = ({ 
  request, 
  isOpen, 
  onClose,
  isOwner = false,
  onJoin,
  onEdit,
  onDelete,
  onStatusChange,
  onViewInterested
}) => {
  const { user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  if (!isOpen || !request) return null;

  const getRequestIcon = (type) => {
    const iconMap = {
      sports: <SportsSoccerIcon className="text-blue-500 text-2xl" />,
      teammate: <GroupIcon className="text-green-500 text-2xl" />,
      trips: <FlightIcon className="text-purple-500 text-2xl" />,
      outing: <FlightIcon className="text-purple-500 text-2xl" />,
      'lost-found': <SearchIcon className="text-orange-500 text-2xl" />,
      roommate: <HomeIcon className="text-red-500 text-2xl" />
    };
    return iconMap[type] || <GroupIcon className="text-gray-500 text-2xl" />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      open: 'bg-green-100 text-green-800 border-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colorMap[status] || colorMap.open;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getTypeDisplayName = (type) => {
    const typeMap = {
      'lost-found': 'Lost & Found',
      'roommate': 'Room-mate'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleShare = async () => {
    const shareData = {
      title: request.title,
      text: `Check out this ${request.type} request: ${request.title}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to localStorage or send to backend
    const message = isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks';
    alert(message);
  };

  const handleReport = () => {
    const reason = prompt('Please provide a reason for reporting this request:');
    if (reason) {
      // Here you would send the report to the backend
      alert('Request reported successfully. Thank you for helping keep our community safe.');
    }
  };

  const renderDetailedContent = () => {
    switch (request.type) {
      case 'sports':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <SportsSoccerIcon className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Sport</p>
                  <p className="font-medium text-gray-900">{request.sportName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AccessTimeIcon className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium text-gray-900">{formatDate(request.date)} at {formatTime(request.time)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <LocationOnIcon className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-medium text-gray-900">{request.venue}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GroupIcon className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Team Size Needed</p>
                  <p className="font-medium text-gray-900">{request.teamSize} players</p>
                </div>
              </div>
            </div>
            {request.description && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Additional Details</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.description}</p>
              </div>
            )}
          </div>
        );

      case 'teammate':
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Project Description</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Requirements</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.requirement}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Teammate Type</p>
                <p className="font-medium text-gray-900">{request.teammateType}</p>
              </div>
              {request.skillsRequired && (
                <div>
                  <p className="text-sm text-gray-600">Skills Required</p>
                  <p className="font-medium text-gray-900">{request.skillsRequired}</p>
                </div>
              )}
            </div>
            {request.additionalInfo && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Additional Information</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.additionalInfo}</p>
              </div>
            )}
          </div>
        );

      case 'trips':
      case 'outing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <LocationOnIcon className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium text-gray-900">{request.destination}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AccessTimeIcon className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(request.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GroupIcon className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Participants Needed</p>
                  <p className="font-medium text-gray-900">{request.participants} people</p>
                </div>
              </div>
              {request.estimatedCost && (
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-medium text-gray-900">{request.estimatedCost}</p>
                </div>
              )}
            </div>
            {request.itinerary && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Itinerary</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.itinerary}</p>
              </div>
            )}
          </div>
        );

      case 'lost-found':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Item Name</p>
                <p className="font-medium text-gray-900">{request.itemName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <AccessTimeIcon className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date Lost/Found</p>
                  <p className="font-medium text-gray-900">{formatDate(request.dateLostFound)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <LocationOnIcon className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{request.locationLostFound}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Item Description</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.itemDescription}</p>
            </div>
            {request.reward && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Reward Offered</p>
                <p className="text-green-800">{request.reward}</p>
              </div>
            )}
          </div>
        );

      case 'roommate':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <LocationOnIcon className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{request.location}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget Range</p>
                <p className="font-medium text-gray-900">{request.budget}</p>
              </div>
              <div className="flex items-center space-x-3">
                <AccessTimeIcon className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Move-in Date</p>
                  <p className="font-medium text-gray-900">{formatDate(request.moveInDate)}</p>
                </div>
              </div>
              {request.roomType && (
                <div>
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="font-medium text-gray-900">{request.roomType}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Preferences & Requirements</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.preferences}</p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-gray-600">No additional details available.</p>
          </div>
        );
    }
  };

  const isUserInterested = request.interestedUsers?.some(u => u.clerkId === user?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {getRequestIcon(request.type)}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status || 'open')} text-white bg-white bg-opacity-20`}>
                    {(request.status || 'open').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {getTypeDisplayName(request.type)}
                  </span>
                </div>
              </div>
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
        <div className="flex-1 overflow-y-auto max-h-96">
          {/* Creator Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <PersonIcon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {request.createdBy?.fullName || 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-gray-600">Request Creator</p>
                  <p className="text-xs text-gray-500">
                    Posted {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {!isOwner && (
                <div className="flex items-center space-x-2">
                  {showContactInfo && request.createdBy?.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <EmailIcon className="text-gray-400" />
                      <span className="text-gray-600">{request.createdBy.email}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showContactInfo ? 'Hide' : 'Show'} Contact
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
            {renderDetailedContent()}
          </div>

          {/* Interest Stats */}
          <div className="px-6 py-4 bg-gray-50 border-y border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <PeopleIcon className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    <strong>{request.interestedUsers?.length || 0}</strong> people interested
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AccessTimeIcon className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Posted {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBookmark}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <ShareIcon />
                  <span>Share</span>
                </button>
                {!isOwner && (
                  <button
                    onClick={handleReport}
                    className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <ReportIcon />
                    <span>Report</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center">
            {isOwner ? (
              // Owner actions
              <>
                <button
                  onClick={() => {
                    onEdit && onEdit(request);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <EditIcon />
                  <span>Edit Request</span>
                </button>
                

                <button
                  onClick={() => {
                    onViewInterested && onViewInterested(request);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  <PeopleIcon />
                  <span>View Interested ({request.interestedUsers?.length || 0})</span>
                </button>
                
                <button
                  onClick={() => {
                    onDelete && onDelete(request);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <DeleteIcon />
                  <span>Delete Request</span>
                </button>
              </>
            ) : (
              // Non-owner actions
              <>
                {!isUserInterested ? (
                  <button
                    onClick={() => {
                      onJoin && onJoin(request._id);
                      onClose();
                    }}
                    disabled={request.status === 'completed' || request.status === 'cancelled'}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                      request.status === 'completed' || request.status === 'cancelled'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    <GroupIcon />
                    <span>Join This Request</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                    <CheckCircleIcon />
                    <span className="font-medium">You&apos;ve already shown interest</span>
                  </div>
                )}
                
                {request.interestedUsers?.length > 0 && (
                  <button
                    onClick={() => {
                      onViewInterested && onViewInterested(request);
                      onClose();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <PeopleIcon />
                    <span>See Who&apos;s Interested</span>
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <CloseIcon />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;