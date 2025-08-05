import React from 'react';
import { useAuth } from '../context/AuthContext';
import zoho from '../zoho.jpg';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold flex items-center space-x-2">
                <img src={zoho} alt="Zoho Logo" className="h-6 w-6 object-contain" />
                <span>Library Management</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-sm">Welcome, </span>
              <span className="font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 