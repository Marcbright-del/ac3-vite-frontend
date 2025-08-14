import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

function Layout() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {/* Navigation Links with new styling */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="py-2 px-4 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/verify" className="py-2 px-4 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Verify Report</Link>
              
              {user && user.role === 'admin' && (
                  <>
                    <Link to="/users" className="py-2 px-4 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">User Management</Link>
                    <Link to="/audit-log" className="py-2 px-4 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Audit Log</Link>
                  </>
              )}
            </div>

            {/* User Info and Logout Button with new styling */}
            {user && (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                    Welcome, {user.username}
                </Link>
                <button 
                  onClick={logoutUser} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-cyan-400">ANTIC Cyber Compliance Checker (AC³)</h1>
          <p className="text-gray-400">A dashboard for monitoring organizational compliance.</p>
        </header>
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;