import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAPI } from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    totalUsers: 0
  });

  // Auto-refresh timer
  useEffect(() => {
    const refreshDataSilent = () => {
      fetchAdminData(true); // Silent refresh
    };

    const interval = setInterval(refreshDataSilent, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check admin access
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminEmail = localStorage.getItem('adminEmail');
    const ADMIN_EMAIL = 'suman_saurabh@srmap.edu.in';
    
    if (!isAdmin || adminEmail !== ADMIN_EMAIL) {
      navigate('/admin/login');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setRefreshing(true);
      
      // Fetch all requests using regular API
      const response = await requestAPI.getAllRequests();
      const allRequests = response.data || response || [];
      
      setRequests(allRequests);
      
      // Calculate stats
      const activeReqs = allRequests.filter(req => 
        req.status === 'open' || req.status === 'active'
      ).length;
      const completedReqs = allRequests.filter(req => req.status === 'completed').length;
      const uniqueUsers = new Set(allRequests.map(req => req.createdBy?.clerkId || req.createdBy)).size;
      
      setStats({
        totalRequests: allRequests.length,
        activeRequests: activeReqs,
        completedRequests: completedReqs,
        totalUsers: uniqueUsers
      });

      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // If there's an error, try to show some sample data for testing
      const sampleRequests = [];
      setRequests(sampleRequests);
      setStats({
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        totalUsers: 0
      });
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = (silent = false) => {
    fetchAdminData(silent);
  };

  const handleDeleteRequest = async (requestId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        // Create admin user data for API calls
        const adminUserData = {
          clerkId: 'admin-user',
          email: 'suman_saurabh@srmap.edu.in',
          fullName: 'Admin User'
        };
        
        await requestAPI.deleteRequest(adminUserData, requestId);
        alert('Request deleted successfully!');
        refreshData(); // Refresh data after deletion
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('Error deleting request');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
    navigate('/admin/login');
  };

  const getAdminUser = () => {
    return localStorage.getItem('adminEmail') || 'Admin';
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-green-100 text-green-800',
      'active': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.open;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e7b34]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Admin Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img src="/logo.png" alt="Campus Connect" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Campus Connect Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {getAdminUser()}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              {refreshing && (
                <div className="flex items-center text-green-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2"></div>
                  <span className="text-xs font-medium">Updating data...</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-[#5e7b34] hover:bg-[#49642a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Stats Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
              <p className="text-sm text-gray-600 mt-1">
                Real-time data • Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Live Updates</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Requests Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Requests</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalRequests}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Requests Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Active Requests</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{stats.activeRequests}</p>
                  <p className="text-xs text-green-600 mt-1">Currently open</p>
                </div>
                <div className="bg-green-200 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Requests Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{stats.completedRequests}</p>
                  <p className="text-xs text-purple-600 mt-1">Resolved</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Users Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Total Users</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{stats.totalUsers}</p>
                  <p className="text-xs text-orange-600 mt-1">Registered</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.5l-4.5 4.5m0 0l-4.5-4.5m4.5 4.5V9a4 4 0 00-4 4v1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Management Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Request Management</h2>
                <p className="text-sm text-gray-600 mt-1">{requests.length} total requests in system</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium border">
                  {requests.length} Records
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Interest Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-500 mb-2">No requests found</p>
                        <p className="text-sm text-gray-400">Requests will appear here when students create them in the app.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((request, index) => (
                    <tr key={request._id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-5">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                              <span className="text-blue-700 font-semibold text-sm">
                                {request.title?.charAt(0)?.toUpperCase() || 'R'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{request.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">{request.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                          {request.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-medium text-xs">
                              {request.createdBy?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.createdBy?.fullName || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">{request.createdBy?.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            request.status === 'active' || request.status === 'open' ? 'bg-green-500' : 
                            request.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                          {request.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {[...Array(Math.min(3, request.interestedUsers?.length || 0))].map((_, i) => (
                              <div key={i} className="w-6 h-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-purple-700 text-xs font-medium">
                                  {String.fromCharCode(65 + i)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {request.interestedUsers?.length || 0}
                            <span className="text-xs text-gray-500 ml-1">interested</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              // Could add view details functionality here
                              alert(`Request Details:\n\nTitle: ${request.title}\nType: ${request.type}\nDescription: ${request.description}\nStatus: ${request.status}\nCreated: ${new Date(request.createdAt).toLocaleString()}`);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                            title="View Details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request._id, request.title)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200"
                            title="Delete Request"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
