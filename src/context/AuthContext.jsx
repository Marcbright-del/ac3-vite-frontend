import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
  );
  const navigate = useNavigate();

  // The base URL for your live backend API
  const API_BASE_URL = 'https://ac3-backend.onrender.com';

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/login/step1/`, { // <-- Changed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.mfa_required) {
          navigate('/login-mfa', { state: { temp_token: data.temp_token } });
        } else {
          setAuthTokens(data);
          setUser(jwtDecode(data.access));
          localStorage.setItem('authTokens', JSON.stringify(data));
          navigate('/');
        }
      } else {
        toast.error('Login failed: Please check your username and password.');
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error('An error occurred during login.');
    }
  };
  
  const verifyMFAAndLogin = async (tempToken, otpCode) => {
      try {
          const response = await fetch(`${API_BASE_URL}/api/login/step2/`, { // <-- Changed
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 'temp_token': tempToken, 'otp_code': otpCode })
          });
          const data = await response.json();
          if (response.ok) {
              setAuthTokens(data);
              setUser(jwtDecode(data.access));
              localStorage.setItem('authTokens', JSON.stringify(data));
              navigate('/');
          } else {
              toast.error(`Verification failed: ${data.error}`);
          }
      } catch (error) {
          console.error("MFA Verification Error:", error);
          toast.error('An error occurred during verification.');
      }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    verifyMFAAndLogin,
    API_BASE_URL, // <-- Add this so other components can use it
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};