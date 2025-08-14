// src/pages/MFALoginPage.jsx
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function MFALoginPage() {
    const [otpCode, setOtpCode] = useState('');
    const { verifyMFAAndLogin } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // The temporary token is passed via navigation state
    const tempToken = location.state?.temp_token;

    // If a user lands here without a temp_token, redirect to login
    if (!tempToken) {
        navigate('/login');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyMFAAndLogin(tempToken, otpCode);
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Two-Factor Authentication</h1>
                <p className="text-center text-gray-400 mb-6">Enter the code from your authenticator app.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="otpCode">Verification Code</label>
                        <input
                            type="text"
                            name="otpCode"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="6-digit code"
                            required
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-center tracking-widest text-lg"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MFALoginPage;