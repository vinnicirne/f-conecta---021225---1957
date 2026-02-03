import React from 'react';

const PostSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/6"></div>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>

                <div className="h-48 bg-gray-100 rounded-xl w-full mt-4"></div>
            </div>

            <div className="px-4 py-3 border-t border-gray-50 flex justify-between">
                <div className="flex space-x-4">
                    <div className="h-8 w-12 bg-gray-100 rounded-lg"></div>
                    <div className="h-8 w-12 bg-gray-100 rounded-lg"></div>
                    <div className="h-8 w-12 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="h-8 w-20 bg-gray-100 rounded-lg"></div>
            </div>
        </div>
    );
};

interface SkeletonFeedProps {
    count?: number;
}

const SkeletonFeed: React.FC<SkeletonFeedProps> = ({ count = 3 }) => {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <PostSkeleton key={i} />
            ))}
        </div>
    );
};

export default SkeletonFeed;
