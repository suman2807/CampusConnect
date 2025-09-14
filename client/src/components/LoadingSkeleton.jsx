import PropTypes from 'prop-types';

const LoadingSkeleton = ({ type = "dashboard", count = 3 }) => {
  const renderDashboardSkeleton = () => (
    <div className="flex flex-col min-h-screen animate-pulse">
      {/* Welcome Header Skeleton */}
      <div className="text-center mt-7 px-4">
        <div className="h-8 bg-gray-300 rounded-lg w-80 mx-auto mb-4"></div>
      </div>

      {/* New Request Section Skeleton */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg mt-6 sm:mt-8 lg:mt-10 w-[95%] sm:w-4/5 mx-auto bg-gray-200">
        <div className="h-10 bg-gray-300 rounded-lg w-48 mx-auto mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Requests Section Skeleton */}
      <div className="w-[95%] sm:w-4/5 mx-auto mt-8 space-y-6">
        {/* My Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-20 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
        <div>
          <div className="h-6 bg-gray-300 rounded w-20 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-16"></div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <div className="h-12 bg-gray-300 rounded w-20"></div>
        <div className="h-12 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );

  const renderSkeletonByType = () => {
    switch (type) {
      case "dashboard":
        return renderDashboardSkeleton();
      case "list":
        return renderListSkeleton();
      case "stats":
        return renderStatsSkeleton();
      case "form":
        return renderFormSkeleton();
      default:
        return renderDashboardSkeleton();
    }
  };

  // For dashboard type, return the full skeleton without repeating
  if (type === "dashboard") {
    return renderDashboardSkeleton();
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeletonByType()}
        </div>
      ))}
    </>
  );
};

LoadingSkeleton.propTypes = {
  type: PropTypes.oneOf(['card', 'list', 'stats', 'form']),
  count: PropTypes.number
};

LoadingSkeleton.defaultProps = {
  type: 'card',
  count: 3
};

export default LoadingSkeleton;