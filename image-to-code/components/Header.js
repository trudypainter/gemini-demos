import React from 'react';
import { Github, Info } from 'lucide-react';

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-white p-4 z-50 ">
      <div className="w-full flex justify-between items-center text-base">
        <div className="text-gray-500">
          <span className="text-black font-bold text-lg mr-2">Image to Code</span>
          Built with <a 
            href="https://ai.google.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-gray-800 transition-colors"
          >
            Gemini 2.0
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/googlecreativelab/gemini-demos/tree/main/image-to-code"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2  text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors "
          >
            <Github size={18} className="text-gray-600" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header; 