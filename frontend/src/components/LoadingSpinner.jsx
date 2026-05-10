import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64 w-full">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );
};

export default LoadingSpinner;
