import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden my-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center p-3">
        <div className="w-10 h-10 rounded-full bg-neutral-300"></div>
        <div className="mr-3 flex-grow">
          <div className="h-4 bg-neutral-300 rounded w-2/5 mb-2"></div>
          <div className="h-3 bg-neutral-300 rounded w-1/4"></div>
        </div>
      </div>
      
      {/* Image */}
      <div className="aspect-w-4 aspect-h-3 bg-neutral-300"></div>

      {/* Actions */}
      <div className="flex items-center p-2">
        <div className="w-8 h-8 rounded-full bg-neutral-300"></div>
        <div className="w-8 h-8 rounded-full bg-neutral-300 mx-2"></div>
        <div className="w-8 h-8 rounded-full bg-neutral-300"></div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <div className="h-4 bg-neutral-300 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-neutral-300 rounded w-full mb-1"></div>
        <div className="h-3 bg-neutral-300 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;