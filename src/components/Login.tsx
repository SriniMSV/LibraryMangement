import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../service/UserService';
import { User, UserRole } from '../types';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.loginUser(data.email, data.password);
      
      console.log('Login API response:', response); // Debug log
      
      // The backend returns: { status: "success", email: "...", role: "...", userId: 123 }
      if (response && response.status === 'success') {
        const user: User = {
          id: response.userId.toString(), // Use the actual userId from backend
          username: data.email.split('@')[0],
          email: response.email,
          name: data.email.split('@')[0],
          role: response.role.toLowerCase() === 'admin' ? UserRole.ADMIN : UserRole.USER,
        };
        login(user);
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      let errorMessage = 'Invalid Credentials, Please check the Email/Password.';
      
      // Handle axios error response
      if (err.response && err.response.status === 401) {
        errorMessage = 'Invalid Credentials, Please check the Email/Password.';
      } else if (err.response && err.response.status === 400) {
        errorMessage = 'Invalid request format. Please check your input.';
      } else if (err.response && err.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message && err.message !== 'Login failed. Please check your credentials.') {
        // Use the original error message if it's not our generic one
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Library Management
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="text-sm text-center text-gray-600">
            <p>Demo credentials:</p>
            <p><strong>Regular Users:</strong></p>
            <p>Email: john@example.com, jane@example.com, or srinivasan@gmail.com</p>
            <p><strong>Admin Users:</strong></p>
            <p>Email: admin@library.com or superadmin@library.com</p>
            <p>Password: any password (6+ characters)</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 