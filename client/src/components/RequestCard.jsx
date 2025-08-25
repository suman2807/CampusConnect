import { useState } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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

const RequestCard = ({ 
  request, 
  isOwner = false, 
  onJoin, 
  onEdit, 
  onDelete, 
  onViewInterested,
  onViewDetails
}) => {
  const [expanded, setExpanded] = useState(false);

  const getRequestIcon = (type) => {
    const iconMap = {
      sports: <SportsSoccerIcon className="text-blue-500" />,
      teammate: <GroupIcon className="text-green-500" />,
      trips: <FlightIcon className="text-purple-500" />,
      outing: <FlightIcon className="text-purple-500" />,
      'lost-found': <SearchIcon className="text-orange-500" />,
      roommate: <HomeIcon className="text-red-500" />
    };
    return iconMap[type] || <GroupIcon className="text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      open: 'bg-green-100 text-green-800 border-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colorMap[status] || colorMap.open;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const renderRequestDetails = () => {
    switch (request.type) {
      case 'teammate':
        return (
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-600 min-w-fit">Description:</span>
              <span className="text-gray-800">{request.description}</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-600 min-w-fit">Requirement:</span>
              <span className="text-gray-800">{request.requirement}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-600">Type:</span>
              <span className="text-gray-800">{request.teammateType}</span>
            </div>
            {request.preferredTeamSize && (
              <div className="flex items-center space-x-2">
                <GroupIcon className="text-green-500 text-sm" />
                <span className="font-semibold text-gray-600">Team Size:</span>
                <span className="text-gray-800">{request.preferredTeamSize}</span>
              </div>
            )}
            {request.skillsRequired && (
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-600 min-w-fit">Skills:</span>
                <span className="text-gray-800">{request.skillsRequired}</span>
              </div>
            )}
            {request.timeCommitment && (
              <div className="flex items-center space-x-2">
                <AccessTimeIcon className="text-gray-500 text-sm" />
                <span className="font-semibold text-gray-600">Time Commitment:</span>
                <span className="text-gray-800">{request.timeCommitment}</span>
              </div>
            )}
            {request.projectDuration && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Duration:</span>
                <span className="text-gray-800">{request.projectDuration}</span>
              </div>
            )}
            {request.additionalInfo && (
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-600 min-w-fit">Additional Info:</span>
                <span className="text-gray-800">{request.additionalInfo}</span>
              </div>
            )}
          </div>
        );

      case 'sports':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SportsSoccerIcon className="text-blue-500 text-sm" />
              <span className="font-semibold text-gray-600">Sport:</span>
              <span className="text-gray-800">{request.sportName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AccessTimeIcon className="text-gray-500 text-sm" />
              <span className="font-semibold text-gray-600">Date & Time:</span>
              <span className="text-gray-800">{formatDate(request.date)} at {formatTime(request.time)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationOnIcon className="text-red-500 text-sm" />
              <span className="font-semibold text-gray-600">Venue:</span>
              <span className="text-gray-800">{request.venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GroupIcon className="text-green-500 text-sm" />
              <span className="font-semibold text-gray-600">Team Size:</span>
              <span className="text-gray-800">{request.teamSize}</span>
            </div>
            {request.skillLevel && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Skill Level:</span>
                <span className="text-gray-800">{request.skillLevel}</span>
              </div>
            )}
            {request.additionalInfo && (
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-600 min-w-fit">Additional Info:</span>
                <span className="text-gray-800">{request.additionalInfo}</span>
              </div>
            )}
          </div>
        );

      case 'trips':
      case 'outing':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <LocationOnIcon className="text-red-500 text-sm" />
              <span className="font-semibold text-gray-600">Destination:</span>
              <span className="text-gray-800">{request.destination}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AccessTimeIcon className="text-gray-500 text-sm" />
              <span className="font-semibold text-gray-600">Date:</span>
              <span className="text-gray-800">{formatDate(request.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GroupIcon className="text-green-500 text-sm" />
              <span className="font-semibold text-gray-600">Participants:</span>
              <span className="text-gray-800">{request.participants}</span>
            </div>
            {request.duration && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Duration:</span>
                <span className="text-gray-800">{request.duration}</span>
              </div>
            )}
            {request.estimatedCost && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Est. Cost:</span>
                <span className="text-gray-800">{request.estimatedCost}</span>
              </div>
            )}
            {request.transportation && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Transport:</span>
                <span className="text-gray-800">{request.transportation}</span>
              </div>
            )}
            {request.accommodation && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Stay:</span>
                <span className="text-gray-800">{request.accommodation}</span>
              </div>
            )}
            {request.meetingPoint && (
              <div className="flex items-center space-x-2">
                <LocationOnIcon className="text-blue-500 text-sm" />
                <span className="font-semibold text-gray-600">Meeting Point:</span>
                <span className="text-gray-800">{request.meetingPoint}</span>
              </div>
            )}
            {request.activities && (
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-600 min-w-fit">Activities:</span>
                <span className="text-gray-800">{request.activities}</span>
              </div>
            )}
          </div>
        );

      case 'lost-found':
        return (
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-600 min-w-fit">Item:</span>
              <span className="text-gray-800">{request.itemName}</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-600 min-w-fit">Description:</span>
              <span className="text-gray-800">{request.itemDescription}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AccessTimeIcon className="text-gray-500 text-sm" />
              <span className="font-semibold text-gray-600">Date:</span>
              <span className="text-gray-800">{formatDate(request.dateLostFound)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationOnIcon className="text-red-500 text-sm" />
              <span className="font-semibold text-gray-600">Location:</span>
              <span className="text-gray-800">{request.locationLostFound}</span>
            </div>
            {request.category && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Category:</span>
                <span className="text-gray-800">{request.category}</span>
              </div>
            )}
            {request.color && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Color:</span>
                <span className="text-gray-800">{request.color}</span>
              </div>
            )}
            {request.brand && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Brand:</span>
                <span className="text-gray-800">{request.brand}</span>
              </div>
            )}
            {request.lostOrFound && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Status:</span>
                <span className={`text-gray-800 px-2 py-1 rounded text-sm ${
                  request.lostOrFound === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {request.lostOrFound === 'lost' ? 'Lost Item' : 'Found Item'}
                </span>
              </div>
            )}
            {request.rewardOffered && (
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-gray-600 min-w-fit">Reward:</span>
                <span className="text-gray-800">{request.rewardOffered}</span>
              </div>
            )}
          </div>
        );

      case 'roommate':
        return (
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-600 min-w-fit">Preferences:</span>
              <span className="text-gray-800">{request.preferences}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-600">Budget:</span>
              <span className="text-gray-800">{request.budget}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationOnIcon className="text-red-500 text-sm" />
              <span className="font-semibold text-gray-600">Location:</span>
              <span className="text-gray-800">{request.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AccessTimeIcon className="text-gray-500 text-sm" />
              <span className="font-semibold text-gray-600">Move In:</span>
              <span className="text-gray-800">{formatDate(request.moveInDate)}</span>
            </div>
            {request.preferredGender && (
              <div className="flex items-center space-x-2">
                <PersonIcon className="text-blue-500 text-sm" />
                <span className="font-semibold text-gray-600">Gender Preference:</span>
                <span className="text-gray-800">{request.preferredGender}</span>
              </div>
            )}
            {request.roomType && (
              <div className="flex items-center space-x-2">
                <HomeIcon className="text-green-500 text-sm" />
                <span className="font-semibold text-gray-600">Room Type:</span>
                <span className="text-gray-800">{request.roomType}</span>
              </div>
            )}
            {request.lifestyle && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Lifestyle:</span>
                <span className="text-gray-800">{request.lifestyle}</span>
              </div>
            )}
            {request.occupation && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Occupation:</span>
                <span className="text-gray-800">{request.occupation}</span>
              </div>
            )}
            {request.ageRange && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Age Range:</span>
                <span className="text-gray-800">{request.ageRange}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getRequestIcon(request.type)}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{request.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status || 'open')}`}>
                  {(request.status || 'open').toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {getTypeDisplayName(request.type)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Basic Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <PersonIcon className="text-gray-400 text-sm" />
            <span className="text-gray-600">Created by:</span>
            <span className="font-medium text-gray-900">
              {request.createdBy?.fullName || request.createdBy?.email || 'Unknown'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <AccessTimeIcon className="text-gray-400 text-sm" />
            <span className="text-gray-600">Created:</span>
            <span className="text-gray-900">{new Date(request.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <PeopleIcon className="text-gray-400 text-sm" />
            <span className="text-gray-600">Interested:</span>
            <span className="font-medium text-blue-600 cursor-pointer hover:text-blue-800" 
                  onClick={() => onViewInterested && onViewInterested(request)}>
              {request.interestedUsers?.length || 0} users
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            {renderRequestDetails()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          {/* Universal View Details Button */}
          <button
            onClick={() => onViewDetails && onViewDetails(request)}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            <PersonIcon className="text-sm" />
            <span>View Details</span>
          </button>

          {isOwner ? (
            // Owner actions
            <>
              <button
                onClick={() => onEdit && onEdit(request)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <EditIcon className="text-sm" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => onDelete && onDelete(request)}
                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <DeleteIcon className="text-sm" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => onViewInterested && onViewInterested(request)}
                className="flex items-center space-x-1 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                <PeopleIcon className="text-sm" />
                <span>Interested ({request.interestedUsers?.length || 0})</span>
              </button>
            </>
          ) : (
            // Non-owner actions
            <>
              <button
                onClick={() => onJoin && onJoin(request._id)}
                disabled={request.status === 'completed' || request.status === 'cancelled'}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  request.status === 'completed' || request.status === 'cancelled'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <GroupIcon className="text-sm" />
                <span>Join Request</span>
              </button>

              {request.interestedUsers?.length > 0 && (
                <button
                  onClick={() => onViewInterested && onViewInterested(request)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <PeopleIcon className="text-sm" />
                  <span>View Interested ({request.interestedUsers?.length})</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

RequestCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      fullName: PropTypes.string,
      email: PropTypes.string,
      clerkId: PropTypes.string
    }),
    interestedUsers: PropTypes.array,
    // Sports specific fields
    sportName: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    venue: PropTypes.string,
    teamSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    skillLevel: PropTypes.string,
    additionalInfo: PropTypes.string,
    // Teammate specific fields
    requirement: PropTypes.string,
    teammateType: PropTypes.string,
    preferredTeamSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    skillsRequired: PropTypes.string,
    timeCommitment: PropTypes.string,
    projectDuration: PropTypes.string,
    // Trips specific fields
    destination: PropTypes.string,
    participants: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.string,
    estimatedCost: PropTypes.string,
    transportation: PropTypes.string,
    accommodation: PropTypes.string,
    activities: PropTypes.string,
    meetingPoint: PropTypes.string,
    contactInfo: PropTypes.string,
    // Lost-Found specific fields
    itemName: PropTypes.string,
    itemDescription: PropTypes.string,
    dateLostFound: PropTypes.string,
    locationLostFound: PropTypes.string,
    lostOrFound: PropTypes.string,
    category: PropTypes.string,
    color: PropTypes.string,
    brand: PropTypes.string,
    rewardOffered: PropTypes.string,
    // Roommate specific fields
    preferences: PropTypes.string,
    budget: PropTypes.string,
    location: PropTypes.string,
    moveInDate: PropTypes.string,
    preferredGender: PropTypes.string,
    roomType: PropTypes.string,
    amenities: PropTypes.string,
    lifestyle: PropTypes.string,
    occupation: PropTypes.string,
    ageRange: PropTypes.string
  }).isRequired,
  isOwner: PropTypes.bool,
  onJoin: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onViewInterested: PropTypes.func,
  onViewDetails: PropTypes.func
};

RequestCard.defaultProps = {
  isOwner: false,
  onJoin: null,
  onEdit: null,
  onDelete: null,
  onViewInterested: null,
  onViewDetails: null
};

export default RequestCard;