import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="block bg-white rounded-xl shadow-lg overflow-hidden m-2 animate-pulse">
      <div className="flex items-center p-4">
        <div className="w-20 h-20 rounded-full bg-gray-300"></div>
        <div className="ms-4 flex-1">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mt-2"></div>
        </div>
        <div className="w-16 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
