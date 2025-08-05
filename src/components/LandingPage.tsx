import React from 'react';
import { Link } from 'react-router-dom';
import zoho from '../zoho.jpg';


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center space-x-4">
              <img src={zoho} alt="Zoho Logo" className="h-12 w-12 object-contain" />
              <span>Library Management System</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to our modern library management platform. Browse, rent, and manage books with ease.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Books</h3>
              <p className="text-gray-600">Explore our extensive collection of books across various genres.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rent Books</h3>
              <p className="text-gray-600">Rent books for flexible durations and track your reading history.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Features</h3>
              <p className="text-gray-600">Comprehensive admin panel for managing books and users.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Try Demo Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Regular Users:</h4>
                <p className="text-gray-600">john@example.com</p>
                <p className="text-gray-600">jane@example.com</p>
                <p className="text-gray-600">srinivasan@gmail.com</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Admin Users:</h4>
                <p className="text-gray-600">admin@library.com</p>
                <p className="text-gray-600">superadmin@library.com</p>
                <p className="text-gray-500 text-xs mt-1">Password: any (6+ chars)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 