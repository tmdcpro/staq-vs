import React, { useState, useEffect } from 'react';
import { X, Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface PRDViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  prdContent?: string;
  prdPath?: string;
}

export function PRDViewModal({ isOpen, onClose, prdContent, prdPath }: PRDViewModalProps) {
  const [content, setContent] = useState<string>(prdContent || '');
  const [loading, setLoading] = useState<boolean>(!prdContent);
  
  useEffect(() => {
    // In a real implementation, we would fetch the content from the file path
    // For this demo, we'll use the content provided or show the content of PROJECT_REQUIREMENTS.md
    if (!prdContent && isOpen) {
      setLoading(true);
      // Simulate fetching the PRD content
      setTimeout(() => {
        fetch('/PROJECT_REQUIREMENTS.md')
          .then(response => response.text())
          .then(text => {
            setContent(text);
            setLoading(false);
          })
          .catch(err => {
            console.error('Error loading PRD:', err);
            setContent('# Error loading PRD\n\nUnable to load the PRD document. Please try again.');
            setLoading(false);
          });
      }, 500);
    } else {
      setContent(prdContent || '');
    }
  }, [prdContent, isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl"
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="font-semibold flex items-center">
            <span className="text-gray-900 dark:text-white">Project Requirements Document</span>
            {prdPath && <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">({prdPath})</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-DEFAULT"></div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-sm">
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Simple markdown formatter (in a real app, you'd use a proper markdown parser)
function formatMarkdown(markdown: string): string {
  // This is a very simplified version - you'd want to use a library like marked or remark in a real app
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gm, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d\. (.*$)/gm, '<li>$1</li>')
    // Code blocks
    .replace(/```([^`]+)```/gm, '<pre><code>$1</code></pre>')
    // Paragraphs
    .replace(/^(?!<[hl]|<li|<pre)(.*$)/gm, '<p>$1</p>');
  
  // Wrap lists
  html = html.replace(/<li>(.+)<\/li>/g, function(match) {
    return '<ul>' + match + '</ul>';
  }).replace(/<\/ul><ul>/g, '');

  return html;
}