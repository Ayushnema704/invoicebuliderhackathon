import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginProps } from '../types';

const Login: React.FC<LoginProps> = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TODO: Implement actual authentication
    if (email && password) {
      // Simulate authentication delay
      setTimeout(() => {
        setIsLoading(false);
        navigate('/invoice');
      }, 800);
    } else {
      setIsLoading(false);
      setError('Please enter both email and password');
    }
  };

  const loginWithDemoAccount = () => {
    setEmail('demo@invoicebuilder.com');
    setPassword('demo123');
    setIsLoading(true);
    setError('');
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/invoice');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 pt-8 pb-12 sm:px-12">
            <div className="mb-8 text-center">
              <Link to="/" className="inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">InvoiceBuilder</span>
              </Link>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to your account to continue
              </p>
            </div>
            
            <div className="mb-6">
              <button
                type="button"
                onClick={loginWithDemoAccount}
                className="flex w-full justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Try with Demo Account
              </button>
            </div>
            
            <div className="flex items-center justify-between my-4">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              <div className="px-2 text-sm text-gray-500 dark:text-gray-400">or</div>
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-gray-100"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-gray-100"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Sign in
                </button>
              </div>
            </form>
            
            <div className="mt-6 flex justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Sign up for free
                </Link>
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/40 px-6 py-4 text-xs text-center text-gray-500 dark:text-gray-400">
            By signing in, you agree to our <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
