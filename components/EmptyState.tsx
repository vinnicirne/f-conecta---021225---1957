import React from 'react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && (
                <div className="mb-4 text-gray-300">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-600 mb-6 max-w-md">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
