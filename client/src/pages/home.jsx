import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { requestAPI } from "../api";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LocalAirportOutlinedIcon from "@mui/icons-material/LocalAirportOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import DirectionsBusFilledOutlinedIcon from "@mui/icons-material/DirectionsBusFilledOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import LandingPage from "../components/LandingPage";
import SportsForm from "../components/SportsForm";
import TeammateForm from "../components/TeammateForm";
import TripsOutingForm from "../components/TripsOutingForm";
import LostFoundForm from "../components/LostFoundForm";
import RoommateForm from "../components/RoommateForm";
import RequestCard from "../components/RequestCard";
import InterestedUsersList from "../components/InterestedUsersList";
import RequestManagement from "../components/RequestManagement";
import RequestStatusManager from "../components/RequestStatusManager";
import RequestDetailModal from "../components/RequestDetailModal";
import LoadingSkeleton from "../components/LoadingSkeleton";

const Home = () => {
  const { isSignedIn, user } = useUser();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [requests, setRequests] = useState([]); // Stores all requests
  const [loading, setLoading] = useState(true); // Add loading state
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequestForModal, setSelectedRequestForModal] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await requestAPI.getAllRequests();
        setRequests(response.data || response || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isSignedIn]);

  const handleButtonClick = (label) => {
    setSelectedRequest(label);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setSelectedRequest("");
  };

  const refreshRequests = async () => {
    try {
      const response = await requestAPI.getAllRequests();
      setRequests(response.data || response || []);
    } catch (error) {
      console.error('Error refreshing requests:', error);
    }
  };

  const handleApply = async (requestId) => {
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
      alert("You have successfully joined the request!");
      
      // Refresh requests to show updated data
      const response = await requestAPI.getAllRequests();
      setRequests(response.data || response || []);
    } catch (error) {
      console.error("Error applying for request: ", error);
      
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
        const response = await requestAPI.getAllRequests();
        setRequests(response.data || response || []);
      } else if (error.response?.status === 401) {
        alert('Authentication error. Please sign in again.');
      } else {
        alert('Error joining request. Please check your connection and try again.');
      }
    }
  };

  const handleViewInterested = (request) => {
    setSelectedRequestForModal(request);
    setShowInterestedModal(true);
  };

  const handleEditRequest = (request) => {
    setSelectedRequestForModal(request);
    setShowManagementModal(true);
  };

  const handleDeleteRequest = async (request) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the request "${request.title}"? This action cannot be undone.`);
    if (confirmDelete) {
      const reason = window.prompt('Please provide a reason for deletion:');
      if (reason) {
        try {
          const userData = {
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            fullName: user.fullName
          };

          await requestAPI.deleteRequest(userData, request._id, reason);
          alert('Request deleted successfully!');
          
          // Refresh requests
          const response = await requestAPI.getAllRequests();
          setRequests(response.data || []);
        } catch (error) {
          console.error('Error deleting request:', error);
          alert('Error deleting request. Please try again.');
        }
      }
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequestForModal(request);
    setShowDetailModal(true);
  };

  const closeModals = () => {
    setShowInterestedModal(false);
    setShowManagementModal(false);
    setShowStatusModal(false);
    setShowDetailModal(false);
    setSelectedRequestForModal(null);
  };

  const handleRequestUpdated = (updatedRequest) => {
    // Update the request in the local state
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req._id === updatedRequest._id ? { ...req, ...updatedRequest } : req
      )
    );
    closeModals();
  };

  const handleRequestDeleted = (deletedRequestId) => {
    // Remove the request from local state
    setRequests(prevRequests => 
      prevRequests.filter(req => req._id !== deletedRequestId)
    );
    closeModals();
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
      const response = await requestAPI.getAllRequests();
      setRequests(response.data || response || []);
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
      const response = await requestAPI.getAllRequests();
      setRequests(response.data || response || []);
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user. Please try again.');
    }
  };

  // Simple test to see if component is rendering
  if (!isSignedIn) {
    return <LandingPage />;
  }

  const myRequests = requests.filter((request) => request.createdBy?.clerkId === user?.id);
  const activeRequests = requests.filter((request) => request.createdBy?.clerkId !== user?.id);

  return (
    <div className="flex flex-col min-h-screen">
      {isSignedIn && user ? (
        // Dashboard for authenticated users
        <div className="text-center mt-7 flex-grow">
          <div className="text-center px-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <span className="text-black">Welcome, </span>
              <span>{user.fullName || user.primaryEmailAddress?.emailAddress || "User"}</span>!
            </h1>
          </div>

          {/* New Request Section */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg mt-6 sm:mt-8 lg:mt-10 w-[95%] sm:w-4/5 mx-auto bg-[#4d6b2c]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">New Request +</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
              {[
                { icon: <EmojiEventsOutlinedIcon style={{ fontSize: "40px" }} />, label: "Sports" },
                { icon: <GroupsOutlinedIcon style={{ fontSize: "40px" }} />, label: "Teammate" },
                { icon: <LocalAirportOutlinedIcon style={{ fontSize: "40px" }} />, label: "Trips" },
                { icon: <DirectionsBusFilledOutlinedIcon style={{ fontSize: "40px" }} />, label: "Outing" },
                { icon: <QuestionMarkOutlinedIcon style={{ fontSize: "40px" }} />, label: "Lost & Found" },      
                { icon: <WindowOutlinedIcon style={{ fontSize: "40px" }} />, label: "Room-mates" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  onClick={() => handleButtonClick(label)}
                  className="bg-[#618b33] w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex flex-col items-center justify-center text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                  {icon}
                  <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-center px-1">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* My Requests */}
          <div className="mt-6 sm:mt-8 lg:mt-10 max-w-7xl mx-auto px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#28430d] text-center sm:text-left">My Requests</h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <LoadingSkeleton type="card" count={3} />
              </div>
            ) : myRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {myRequests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    isOwner={true}
                    onEdit={handleEditRequest}
                    onDelete={handleDeleteRequest}
                    onViewInterested={handleViewInterested}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-600 text-base sm:text-lg">You haven&apos;t created any requests yet.</p>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Click the buttons above to create your first request!</p>
              </div>
            )}
          </div>

          {/* Active Requests - Preview */}
          <div className="mt-6 sm:mt-8 lg:mt-10 max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#28430d] text-center sm:text-left">Active Requests</h2>
              <a 
                href="/requests" 
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                View All Requests →
              </a>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <LoadingSkeleton type="card" count={6} />
              </div>
            ) : activeRequests.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {activeRequests.slice(0, 6).map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      isOwner={false}
                      onJoin={handleApply}
                      onViewInterested={handleViewInterested}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
                {activeRequests.length > 6 && (
                  <div className="text-center mt-4 sm:mt-6">
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      Showing 6 of {activeRequests.length} active requests
                    </p>
                    <a 
                      href="/requests" 
                      className="inline-block bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base"
                    >
                      View All {activeRequests.length} Requests
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-600 text-base sm:text-lg">No active requests from other users.</p>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Check back later for new opportunities to connect!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <LandingPage />
      )}

      {/* Render the appropriate form based on selected request type */}
      {sidebarVisible && (
        <>
          {selectedRequest === "Sports" && <SportsForm closeForm={closeSidebar} refreshRequests={refreshRequests} />}
          {selectedRequest === "Teammate" && <TeammateForm closeForm={closeSidebar} refreshRequests={refreshRequests} />}
          {(selectedRequest === "Trips" || selectedRequest === "Outing") && <TripsOutingForm closeForm={closeSidebar} refreshRequests={refreshRequests} />}
          {selectedRequest === "Lost & Found" && <LostFoundForm closeForm={closeSidebar} refreshRequests={refreshRequests} />}
          {selectedRequest === "Room-mates" && <RoommateForm closeForm={closeSidebar} refreshRequests={refreshRequests} />}
        </>
      )}

      {/* Interested Users Modal */}
      <InterestedUsersList
        request={selectedRequestForModal}
        isOpen={showInterestedModal}
        onClose={closeModals}
        onAcceptUser={handleAcceptUser}
        onRejectUser={handleRejectUser}
      />

      {/* Request Management Modal */}
      <RequestManagement
        request={selectedRequestForModal}
        isOpen={showManagementModal}
        onClose={closeModals}
        onRequestUpdated={handleRequestUpdated}
        onRequestDeleted={handleRequestDeleted}
      />

      {/* Request Status Manager Modal */}
      <RequestStatusManager
        request={selectedRequestForModal}
        isOpen={showStatusModal}
        onClose={closeModals}
        onStatusUpdated={handleRequestUpdated}
      />

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequestForModal}
        isOpen={showDetailModal}
        onClose={closeModals}
        isOwner={selectedRequestForModal?.createdBy?.clerkId === user?.id}
        onJoin={handleApply}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        onViewInterested={handleViewInterested}
      />
    </div>
  );
};

export default Home;