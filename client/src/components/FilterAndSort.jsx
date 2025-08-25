import { useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FilterAndSort = ({ 
  onFilterChange, 
  onSortChange, 
  onSearchChange,
  totalRequests = 0,
  filteredCount = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    interestedUsersMin: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const requestTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'sports', label: 'Sports' },
    { value: 'teammate', label: 'Teammate' },
    { value: 'trips', label: 'Trips' },
    { value: 'outing', label: 'Outing' },
    { value: 'lost-found', label: 'Lost & Found' },
    { value: 'roommate', label: 'Room-mates' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'type', label: 'Type' },
    { value: 'interestedUsers', label: 'Interest Level' },
    { value: 'status', label: 'Status' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    let newSortOrder = sortOrder;
    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newSortOrder = 'desc';
    }
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSortChange({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      type: 'all',
      status: 'all',
      dateRange: 'all',
      interestedUsersMin: ''
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    setSortBy('createdAt');
    setSortOrder('desc');
    
    onFilterChange(defaultFilters);
    onSortChange({ sortBy: 'createdAt', sortOrder: 'desc' });
    onSearchChange('');
  };

  const hasActiveFilters = () => {
    return filters.type !== 'all' || 
           filters.status !== 'all' || 
           filters.dateRange !== 'all' || 
           filters.interestedUsersMin !== '' ||
           searchQuery !== '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      {/* Header with Toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FilterListIcon />
              <span className="font-medium">Filters & Sort</span>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
            
            {hasActiveFilters() && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              Showing {filteredCount} of {totalRequests} requests
            </span>
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
              >
                <ClearIcon className="text-sm" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar - Always Visible */}
        <div className="mt-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests by title, description, creator..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Request Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {requestTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRangeOptions.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Interested Users */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. Interested Users
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.interestedUsersMin}
                onChange={(e) => handleFilterChange('interestedUsersMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <SortIcon className="text-sm" />
                  <span>{option.label}</span>
                  {sortBy === option.value && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleFilterChange('status', 'open');
                  handleSortChange('interestedUsers');
                }}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                Open Requests
              </button>
              <button
                onClick={() => {
                  handleFilterChange('interestedUsersMin', '1');
                  handleSortChange('interestedUsers');
                }}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Popular Requests
              </button>
              <button
                onClick={() => {
                  handleFilterChange('dateRange', 'today');
                  handleSortChange('createdAt');
                }}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                Today&apos;s Requests
              </button>
              <button
                onClick={() => {
                  handleFilterChange('type', 'sports');
                  handleFilterChange('status', 'open');
                }}
                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200 transition-colors"
              >
                Sports Activities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterAndSort;