import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import OrganizationDetailPage from './pages/OrganizationDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PrivateRoute from './utils/PrivateRoute.jsx';
import VerificationPage from './pages/VerificationPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; 
import MFALoginPage from './pages/MFALoginPage.jsx';
import { ToastContainer } from 'react-toastify'; // <-- Import component
import 'react-toastify/dist/ReactToastify.css'; // <-- Import CSS
import AuditLogPage from './pages/AuditLogPage.jsx';

function App() {
  return (
     <>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="organization/:id" element={<OrganizationDetailPage />} />
          <Route path="verify" element={<VerificationPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="profile" element={<ProfilePage />} /> {/* <-- Make sure this route is here */}
          <Route path="audit-log" element={<AuditLogPage />} /> 
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-mfa" element={<MFALoginPage />} />
    </Routes>
     <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;