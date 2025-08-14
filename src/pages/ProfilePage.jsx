import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import useAuthFetch from '../hooks/useAuthFetch.js';
import { toast } from 'react-toastify';

function ProfilePage() {
    const { user } = useContext(AuthContext);
    const [qrCode, setQrCode] = useState(null);
    const [otpCode, setOtpCode] = useState('');
    // Initialize with a safe default value
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const authFetch = useAuthFetch();

    // This effect will run when the user object is loaded or changes
    useEffect(() => {
        if (user && user.profile) {
            setMfaEnabled(user.profile.mfa_enabled);
        }
    }, [user]);

    const handleGenerateQR = async () => {
        try {
            const response = await authFetch('/api/mfa/setup/');
            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qr_code_svg);
            }
        } catch (error) {
            console.error("Failed to generate QR code:", error);
        }
    };

    const handleVerifyMFA = async (e) => {
        e.preventDefault();
        try {
            const response = await authFetch('/api/mfa/setup/', {
                method: 'POST',
                body: JSON.stringify({ otp_code: otpCode }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('MFA enabled successfully!');
                setMfaEnabled(true);
                setQrCode(null);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to verify OTP:", error);
        }
    };

    // This is the main fix: Don't try to render anything until the user object is loaded
    if (!user) {
        return <div className="text-center p-4">Loading Profile...</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
            <div className="mb-6">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>MFA Status:</strong> 
                    <span className={mfaEnabled ? 'text-green-400' : 'text-red-400'}>
                        {mfaEnabled ? ' Enabled' : ' Disabled'}
                    </span>
                </p>
            </div>

            {!mfaEnabled && !qrCode && (
                <button onClick={handleGenerateQR} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
                    Enable MFA
                </button>
            )}

            {qrCode && (
                <div>
                    <h3 className="text-xl mb-2">Scan this QR Code</h3>
                    <p className="text-gray-400 mb-4">Open your authenticator app (like Google Authenticator or Authy) and scan the image below.</p>
                    <div dangerouslySetInnerHTML={{ __html: qrCode }} className="bg-white p-4 inline-block rounded-lg" />

                    <form onSubmit={handleVerifyMFA} className="mt-6">
                        <label className="block text-gray-400 mb-2">Enter Verification Code</label>
                        <input 
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="6-digit code"
                            required
                            className="p-2 rounded bg-gray-700 w-48"
                        />
                        <button type="submit" className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                            Verify & Enable
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;