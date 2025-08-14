// src/pages/VerificationPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthFetch from '../hooks/useAuthFetch';

function VerificationPage() {
    const [scanId, setScanId] = useState('');
    const [file, setFile] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const authFetch = useAuthFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!scanId || !file) {
            alert('Please provide a Scan ID and select a report file.');
            return;
        }

        setIsLoading(true);
        setVerificationResult(null);

        // FormData is used to send files to a server
        const formData = new FormData();
        formData.append('scan_id', scanId);
        formData.append('report', file);

        try {
            // When sending FormData, the browser sets the 'Content-Type' header automatically.
            // So we remove it from our authFetch call for this request.
            const response = await authFetch('/api/scans/verify/', {
                method: 'POST',
                
                body: formData,
            });
            const data = await response.json();
            setVerificationResult(data);
        } catch (error) {
            console.error("Verification failed:", error);
            setVerificationResult({ verified: false, reason: 'An error occurred during upload.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">&larr; Back to Dashboard</Link>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6">Verify Report Authenticity</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Scan ID</label>
                        <input
                            type="number"
                            value={scanId}
                            onChange={(e) => setScanId(e.target.value)}
                            placeholder="Enter the Scan ID from the report"
                            required
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Report PDF File</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept="application/pdf"
                            required
                            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">
                        {isLoading ? 'Verifying...' : 'Verify Report'}
                    </button>
                </form>

                {verificationResult && (
                    <div className={`mt-6 p-4 rounded-lg text-center ${verificationResult.verified ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        <h3 className="font-bold text-lg">{verificationResult.verified ? '✅ Verification Successful' : '❌ Verification Failed'}</h3>
                        <p>{verificationResult.reason}</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default VerificationPage;