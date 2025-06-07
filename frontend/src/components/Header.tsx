import React from 'react';
import { Database, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ParticleBackground from './ParticleBackground';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-6 px-4 shadow-lg overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="flex items-center mb-4 md:mb-0">
          <Database className="h-8 w-8 mr-3 text-purple-300" />
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">Quantic Search</h1>
            <p className="text-sm text-purple-200 hidden sm:block">Advanced Information Retrieval</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-purple-700/50 transition-colors duration-200"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;