import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import SearchInterface from './components/SearchInterface';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SearchInterface />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;