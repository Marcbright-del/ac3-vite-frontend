// src/pages/AuditLogPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import useAuthFetch from '../hooks/useAuthFetch.js';

function AuditLogPage() {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const authFetch = useAuthFetch();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await authFetch('/api/auditlogs/');
                const data = await response.json();
                if (response.ok) {
                    setLogs(data);
                }
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            }
        };

        if (user?.role === 'admin') {
            fetchLogs();
        }
    }, [user]);

    // If the user is not an admin, redirect them to the home page
    if (user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Audit Trail</h2>

        {/* --- Mobile View (hidden on medium screens and up) --- */}
        <div className="space-y-4 md:hidden">
            {Array.isArray(logs) && logs.map(log => (
                <div key={log.id} className="bg-gray-700 p-4 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">{log.username}</p>
                        <p className="text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                    <p><span className="font-bold">Action:</span> {log.action}</p>
                    <p className="text-gray-300"><span className="font-bold">Details:</span> {log.details}</p>
                </div>
            ))}
        </div>

        {/* --- Desktop Table (hidden on small screens) --- */}
        <table className="w-full text-left hidden md:table">
            <thead className="border-b-2 border-gray-700">
                <tr>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Details</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(logs) && logs.map(log => (
                    <tr key={log.id} className="border-b border-gray-700/50 text-sm">
                        <td className="p-2 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-2 font-semibold">{log.username}</td>
                        <td className="p-2">{log.action}</td>
                        <td className="p-2 text-gray-300">{log.details}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default AuditLogPage;