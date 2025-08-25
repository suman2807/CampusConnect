import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { requestAPI } from '../api';
import RequestCard from '../components/RequestCard';
import InterestedUsersList from '../components/InterestedUsersList';
import FilterAndSort from '../components/FilterAndSort';
import LoadingSkeleton from '../components/LoadingSkeleton';

import RequestDetailModal from '../components/RequestDetailModal';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Active_request = () => {
  const { isSignedIn, user } = useUser();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    openRequests: 0,
    totalInterested: 0,
    recentRequests: 0
  });

  useEffect(() => {
    if (isSignedIn) {
      fetchRequests();
    }
  }, [isSignedIn]);

  useEffect(() => {
    calculateStats();
  }, [requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getAllRequests();
      const allRequests = response.data || response || [];
      
      // Filter out user's own requests to show only active requests from others
      const activeRequests = user 
        ? allRequests.filter(request => request.createdBy?.clerkId !== user.id)
        : allRequests;
      
      setRequests(activeRequests);
      setFilteredRequests(activeRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = requests.length;
    const openRequests = requests.filter(r => (r.status || 'open') === 'open').length;
    const totalInterested = requests.reduce((sum, r) => sum + (r.interestedUsers?.length || 0), 0);
    const recentRequests = requests.filter(r => {
      const createdDate = new Date(r.createdAt);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return createdDate >= yesterday;
    }).length;

    setStats({ total, openRequests, totalInterested, recentRequests });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleJoinRequest = async (requestId) => {
    if (!isSignedIn || !user) {
      alert('Please sign in to apply for requests.');
      return;
    }

    try {
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName
      };

      await requestAPI.joinRequest(userData, requestId);
      alert('You have successfully joined the request!');
      
      // Refresh requests to show updated data
      await fetchRequests();
    } catch (error) {
      console.error('Error applying for request:', error);
      
      // Handle different error cases with specific messages
      const errorMessage = error.response?.data?.error;
      
      if (error.response?.status === 400) {
        if (errorMessage?.includes('Already joined')) {
          alert('You have already applied for this request.');
        } else if (errorMessage?.includes('own request')) {
          alert('You cannot apply to your own request.');
        } else if (errorMessage?.includes('completed') || errorMessage?.includes('cancelled')) {
          alert('This request is no longer accepting applications.');
        } else if (errorMessage?.includes('Invalid request ID')) {
          alert('Invalid request. Please refresh the page and try again.');
        } else {
          alert(errorMessage || 'Cannot join this request.');
        }
      } else if (error.response?.status === 404) {
        alert('Request not found. It may have been deleted.');
        // Refresh requests to remove deleted ones
        await fetchRequests();
      } else if (error.response?.status === 401) {
        alert('Authentication error. Please sign in again.');
      } else {
        alert('Error joining request. Please check your connection and try again.');
      }
    }
  };

  const handleViewInterested = (request) => {
    setSelectedRequest(request);
    setShowInterestedModal(true);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const closeInterestedModal = () => {
    setShowInterestedModal(false);
    setSelectedRequest(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  // Approve/Reject User Functions
  const handleAcceptUser = async (requestId, userId) => {
    if (!isSignedIn || !user) {
      alert('Please sign in to manage requests.');
      return;
    }

    try {
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName
      };

      await requestAPI.acceptUser(userData, requestId, userId);
      alert('User accepted successfully!');
      
      // Refresh requests to show updated data
      await fetchRequests();
    } catch (error) {
      console.error('Error accepting user:', error);
      alert('Error accepting user. Please try again.');
    }
  };

  const handleRejectUser = async (requestId, userId) => {
    if (!isSignedIn || !user) {
      alert('Please sign in to manage requests.');
      return;
    }

    try {
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName
      };

      await requestAPI.rejectUser(userData, requestId, userId);
      alert('User rejected successfully!');
      
      // Refresh requests to show updated data
      await fetchRequests();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user. Please try again.');
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...requests];

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(request => request.type === filters.type);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(request => (request.status || 'open') === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let dateThreshold;
      
      switch (filters.dateRange) {
        case 'today':
          dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateThreshold = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          dateThreshold = null;
      }
      
      if (dateThreshold) {
        filtered = filtered.filter(request => new Date(request.createdAt) >= dateThreshold);
      }
    }

    // Apply minimum interested users filter
    if (filters.interestedUsersMin && filters.interestedUsersMin !== '') {
      const minUsers = parseInt(filters.interestedUsersMin);
      filtered = filtered.filter(request => (request.interestedUsers?.length || 0) >= minUsers);
    }

    setFilteredRequests(filtered);
  };

  const handleSortChange = ({ sortBy, sortOrder }) => {
    const sorted = [...filteredRequests].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'title':
          valueA = a.title?.toLowerCase() || '';
          valueB = b.title?.toLowerCase() || '';
          break;
        case 'type':
          valueA = a.type || '';
          valueB = b.type || '';
          break;
        case 'interestedUsers':
          valueA = a.interestedUsers?.length || 0;
          valueB = b.interestedUsers?.length || 0;
          break;
        case 'status':
          valueA = a.status || 'open';
          valueB = b.status || 'open';
          break;
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRequests(sorted);
  };

  const handleSearchChange = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = requests.filter(request => 
      request.title?.toLowerCase().includes(query) ||
      request.description?.toLowerCase().includes(query) ||
      request.sportName?.toLowerCase().includes(query) ||
      request.destination?.toLowerCase().includes(query) ||
      request.createdBy?.fullName?.toLowerCase().includes(query) ||
      request.createdBy?.email?.toLowerCase().includes(query)
    );

    setFilteredRequests(filtered);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view active requests</h2>
          <p className="text-gray-600">You need to be signed in to see and join requests from other users.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="h-8 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <LoadingSkeleton type="stats" count={4} />
            </div>
          </div>

          {/* Filter Skeleton */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <LoadingSkeleton type="form" count={1} />
          </div>

          {/* Requests Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Active Requests</h1>
              <p className="text-gray-600 mt-1">
                Discover and join requests from other users in your community
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUpIcon className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AccessTimeIcon className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open Requests</p>
                  <p className="text-2xl font-bold text-green-600">{stats.openRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GroupIcon className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalInterested}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AccessTimeIcon className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent (24h)</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.recentRequests}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort */}
        <FilterAndSort
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
          totalRequests={requests.length}
          filteredCount={filteredRequests.length}
        />

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <GroupIcon className="text-gray-300 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {requests.length === 0 ? 'No active requests available' : 'No requests match your filters'}
            </h3>
            <p className="text-gray-600">
              {requests.length === 0 
                ? 'Be the first to create a request and connect with others!' 
                : 'Try adjusting your filters or search terms to find more requests.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                isOwner={false}
                onJoin={handleJoinRequest}
                onViewInterested={handleViewInterested}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Interested Users Modal */}
        <InterestedUsersList
          request={selectedRequest}
          isOpen={showInterestedModal}
          onClose={closeInterestedModal}
          onAcceptUser={handleAcceptUser}
          onRejectUser={handleRejectUser}
        />

        {/* Request Detail Modal */}
        <RequestDetailModal
          request={selectedRequest}
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          isOwner={false}
          onJoin={handleJoinRequest}
          onViewInterested={handleViewInterested}
        />
      </div>
    </div>
  );
};

export default Active_request
