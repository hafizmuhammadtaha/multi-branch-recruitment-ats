import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({ message, icon: Icon = SearchX }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No Results Found</h3>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
