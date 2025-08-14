// src/pages/LoginPage.jsx
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Login</h1>
        <form onSubmit={loginUser}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter Username"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;