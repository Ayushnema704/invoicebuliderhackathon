import React from 'react';
import { Link } from 'react-router-dom';
import { LandingProps } from '../types';

const Landing: React.FC<LandingProps> = ({ darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">InvoiceBuilder</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode?.(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4 animate-pulse">
                  Simplified Invoicing for Everyone
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Create Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Invoices in Minutes</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Streamline your invoicing process with our intuitive invoice builder. Create, customize, and send professional invoices with just a few clicks.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Get Started — Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-center shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  View Demo
                </Link>
              </div>
              
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 ${
                      ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'][i]
                    }`}></div>
                  ))}
                </div>
                <span>Trusted by 10,000+ businesses worldwide</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl transform rotate-3 blur opacity-20 dark:opacity-30 -z-10"></div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
                  <div className="flex space-x-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Invoice Preview</div>
                  <div></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded mb-2"></div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 ml-auto"></div>
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1 ml-auto"></div>
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <table className="w-full mb-6">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-2 text-left"><div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></th>
                        <th className="pb-2 text-right"><div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></th>
                        <th className="pb-2 text-right"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></th>
                        <th className="pb-2 text-right"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(3)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2"><div style={{width: `calc(60px + ${i*30}px)`}} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                          <td className="py-2 text-right"><div className="h-3 w-5 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></td>
                          <td className="py-2 text-right"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></td>
                          <td className="py-2 text-right"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <div className="w-48">
                      <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                        <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-16 bg-blue-500 dark:bg-blue-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white dark:bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage invoices
            </p>
            <p className="mt-5 text-xl text-gray-500 dark:text-gray-400">
              Our platform streamlines the entire invoicing process, saving you time and ensuring professional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                ),
                title: "Lightning Fast Creation",
                description: "Create professional invoices in seconds, not minutes. Our intuitive interface makes it simple to get started and easy to customize."
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                ),
                title: "Beautiful Templates",
                description: "Choose from a variety of professionally designed templates that make your business look its best."
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                ),
                title: "Automatic Calculations",
                description: "Let our system handle the math. Taxes, discounts, and totals are calculated automatically with precision."
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
                title: "PDF Export",
                description: "Generate professional PDF invoices with a single click for easy sharing and record-keeping."
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                ),
                title: "Client Management",
                description: "Store client information for quick invoice creation and maintain a professional relationship with your customers."
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Secure & Private",
                description: "Your data is secure with our enterprise-grade security. Your business information stays private and protected."
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
        <div className="absolute inset-0 bg-grid-white/[0.15]"></div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:py-24 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to simplify your invoicing?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of businesses who have already transformed their invoicing process. 
              Start creating professional invoices today with our free plan.
            </p>
          </div>
          <div className="mt-10 lg:mt-0 flex flex-col sm:flex-row gap-4">
            <Link to="/login" className="px-6 py-3 rounded-lg bg-white text-blue-600 font-medium text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/50">
              Try for Free
            </Link>
            <Link to="/login" className="px-6 py-3 rounded-lg bg-blue-500/30 text-white border border-blue-300/30 font-medium text-center hover:bg-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/50">
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-bold text-gray-900 dark:text-white">InvoiceBuilder</span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Making professional invoicing accessible for businesses of all sizes.
              </p>
              <div className="mt-6 flex space-x-4">
                {["twitter", "facebook", "instagram", "github", "linkedin"].map(social => (
                  <a key={social} href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-2">
                  {["Features", "Pricing", "Templates", "Customers", "Integrations"].map(item => (
                    <li key={item}>
                      <a href="#" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-2">
                  {["Documentation", "Guides", "API Status", "Contact Us", "Privacy", "Terms"].map(item => (
                    <li key={item}>
                      <a href="#" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subscribe</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Get the latest news and updates</p>
              <form className="mt-4 flex">
                <input
                  type="email"
                  className="min-w-0 flex-1 appearance-none rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-base text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-r-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} InvoiceBuilder. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-6">
              {["Privacy", "Terms", "Cookies"].map(item => (
                <a key={item} href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
