import PropTypes from 'prop-types';

const LoadingSkeleton = ({ type = "card", count = 3 }) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <div className="h-5 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="flex space-x-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
        <div className="h-9 bg-gray-300 rounded w-24"></div>
        <div className="h-9 bg-gray-300 rounded w-20"></div>
        <div className="h-9 bg-gray-300 rounded w-28"></div>
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
      case "card":
        return renderCardSkeleton();
      case "list":
        return renderListSkeleton();
      case "stats":
        return renderStatsSkeleton();
      case "form":
        return renderFormSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

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