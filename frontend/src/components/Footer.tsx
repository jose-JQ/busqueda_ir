import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Database, Github, Mail, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`
      mt-12 py-8 border-t
      ${theme === 'dark' 
        ? 'bg-gray-900 text-gray-300 border-gray-800' 
        : 'bg-gray-50 text-gray-700 border-gray-200'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Database className="h-6 w-6 mr-2 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold">Quantic Search</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Advanced Information Retrieval
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              className={`
                p-2 rounded-full transition-colors duration-200
                ${theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}
              `}
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="#" 
              className={`
                p-2 rounded-full transition-colors duration-200
                ${theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}
              `}
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="#" 
              className={`
                p-2 rounded-full transition-colors duration-200
                ${theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}
              `}
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;