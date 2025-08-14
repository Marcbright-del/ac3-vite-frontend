import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthFetch from '../hooks/useAuthFetch.js';
import Spinner from '../components/Spinner.jsx';

function OrganizationDetailPage() {
    const [organization, setOrganization] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const authFetch = useAuthFetch();

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const response = await authFetch(`/api/organizations/${id}/`);
                const data = await response.json();
                if (response.ok) {
                    setOrganization(data);
                }
            } catch (error) {
                console.error("Error fetching organization details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleDownloadReport = async (scan) => {
        try {
            const response = await authFetch(`/api/scans/${scan.uuid}/report/`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compliance_report_${organization.name}_${scan.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to download report.');
            }
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!organization) {
        return <div className="text-white text-center p-10">Organization not found.</div>;
    }

    return (
        <>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">&larr; Back to Dashboard</Link>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
                <h2 className="text-3xl font-bold mb-2">{organization.name}</h2>
                <p className="text-gray-400">{organization.industry}</p>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-300">Scan History</h3>
                {organization.scans && organization.scans.length > 0 ? (
                    <div className="space-y-6">
                        {organization.scans.map(scan => (
                            <div key={scan.id} className="bg-gray-800 p-6 rounded-lg shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-bold text-xl">Scan on {new Date(scan.scan_date).toLocaleString()}</p>
                                        <p className="text-gray-400">Overall Score: {scan.compliance_score}%</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDownloadReport(scan)}
                                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-xs"
                                    >
                                        Download Report
                                    </button>
                                </div>

                                {/* --- Mobile View --- */}
                                <div className="space-y-2 md:hidden">
                                    {scan.results.map(result => (
                                        <div key={result.id} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                                            <span>{result.checklist_item_name}</span>
                                            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                                                result.status === 'pass' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {result.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* --- Desktop Table --- */}
                                <table className="w-full text-left hidden md:table">
                                    <thead className="border-b-2 border-gray-700">
                                        <tr>
                                            <th className="p-2">Checklist Item</th>
                                            <th className="p-2 text-center">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scan.results.map(result => (
                                            <tr key={result.id} className="border-b border-gray-700/50">
                                                <td className="p-2">{result.checklist_item_name}</td>
                                                <td className="p-2 text-center">
                                                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                                                        result.status === 'pass' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                                    }`}>
                                                        {result.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                        <p>No scans found for this organization.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default OrganizationDetailPage;