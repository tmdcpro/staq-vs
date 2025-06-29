import React, { useState } from 'react';
import { File, Upload, Plus, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface PRDSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPRD: (path: string) => void;
}

export function PRDSelectionModal({ isOpen, onClose, onSelectPRD }: PRDSelectionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isFilePickerSupported, setIsFilePickerSupported] = useState(true);
  const [recentPRDs, setRecentPRDs] = useState([
    { name: 'PROJECT_REQUIREMENTS.md', path: '/home/user/projects/dwo/PROJECT_REQUIREMENTS.md', lastModified: '2024-06-28' },
    { name: 'E-Commerce Platform PRD.md', path: '/home/user/projects/ecommerce/PRD.md', lastModified: '2024-06-20' },
    { name: 'Mobile App Requirements.md', path: '/home/user/projects/mobile/Requirements.md', lastModified: '2024-06-15' }
  ]);

  React.useEffect(() => {
    // Check if file picker is supported in this environment
    const isSupported = window.File && window.FileReader && window.FileList && window.Blob;
    setIsFilePickerSupported(isSupported);
    console.log('File picker supported:', isSupported);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event triggered', event.target.files);
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      console.log('File selected:', event.target.files[0].name);
    }
  };

  const handleFileButtonClick = () => {
    console.log('File button clicked, trying to open file picker');
    if (fileInputRef.current) {
      console.log('File input ref exists, clicking...');
      fileInputRef.current.click();
    } else {
      console.log('File input ref is null');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      console.log('File dropped:', files[0].name);
    }
    fileInputRef.current?.click();
  };

  const handleImport = () => {
    if (selectedFile) {
      // In a real app, you'd handle the file upload here
      onSelectPRD(selectedFile.name);
      onClose();
    }
  };

  const selectRecentPRD = (path: string) => {
    onSelectPRD(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg flex flex-col shadow-xl"
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="font-semibold text-gray-900 dark:text-white flex items-center">
            <FileText className="mr-2" size={18} />
            <span>Select Project Requirements Document</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Import PRD</h3>
            <div 
              className="border-2 border-dashed rounded-lg p-6 border-gray-300 dark:border-gray-600 text-center hover:border-primary-DEFAULT transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="prd-file"
                accept=".md,.txt,.pdf,.json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {!isFilePickerSupported && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    File picker not available in this environment. Please use one of the recent PRDs below or paste content directly.
                  </p>
                </div>
              )}
              
              <div>
                {selectedFile ? (
                  <div className="flex items-center justify-center">
                    <File className="h-8 w-8 text-primary-DEFAULT mb-2" />
                    <span className="block text-sm font-medium text-gray-900 dark:text-white ml-2">{selectedFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isFilePickerSupported ? 'Click to upload or drag and drop' : 'Drag and drop your PRD file here'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Markdown, PDF, or JSON
                    </span>
                  </div>
                )}
              </div>
              
              {isFilePickerSupported && (
                <button
                  type="button"
                  onClick={handleFileButtonClick}
                  className="mt-3 px-4 py-2 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-md transition-colors"
                >
                  Choose File
                </button>
              )}
            </div>
            
            {!isFilePickerSupported && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or paste PRD content directly:
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Paste your PRD markdown content here..."
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      // Create a virtual file from the pasted content
                      const blob = new Blob([e.target.value], { type: 'text/markdown' });
                      const file = new File([blob], 'pasted-prd.md', { type: 'text/markdown' });
                      setSelectedFile(file);
                    } else {
                      setSelectedFile(null);
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Recent PRDs</h3>
            <ul className="space-y-2">
              {recentPRDs.map((prd) => (
                <li key={prd.path}>
                  <button
                    onClick={() => selectRecentPRD(prd.path)}
                    className="w-full flex items-start p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary-DEFAULT flex-shrink-0" />
                    <div className="ml-3 text-left flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {prd.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {prd.path}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {prd.lastModified}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-md text-white transition-colors ${selectedFile ? 'bg-primary-DEFAULT hover:bg-primary-dark' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Import
          </button>
        </div>
      </motion.div>
    </div>
  );
}