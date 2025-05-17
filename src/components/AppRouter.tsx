import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import InvoiceApp from './InvoiceApp';

const AppRouter: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem('invoiceBuilderDarkMode');
    if (savedDarkMode !== null) {
      return savedDarkMode === 'true';
    }
    // If no saved preference, check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('invoiceBuilderDarkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/register" element={<Login darkMode={darkMode} />} />
        <Route path="/invoice" element={<InvoiceApp darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter; 