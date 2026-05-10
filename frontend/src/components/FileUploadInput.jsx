import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const FileUploadInput = ({ label, accept, onChange, error, required }) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50 bg-white'}`}
      >
        <div className="space-y-1 text-center w-full">
          {!fileName ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload a file</span>
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {accept} up to 5MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-primary-50 p-3 rounded-lg border border-primary-100">
              <div className="flex items-center space-x-3 truncate">
                <FileText className="text-primary-500 flex-shrink-0" size={24} />
                <span className="text-sm font-medium text-primary-900 truncate">{fileName}</span>
              </div>
              <button 
                type="button" 
                onClick={clearFile}
                className="p-1 hover:bg-primary-100 rounded-full transition-colors text-primary-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message || error}</p>}
    </div>
  );
};

export default FileUploadInput;
