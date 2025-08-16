import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrganizationForm from '../components/OrganizationForm.jsx';
import AuthContext from '../context/AuthContext.jsx';
import useAuthFetch from '../hooks/useAuthFetch.js';
import Spinner from '../components/Spinner.jsx';

function HomePage() {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, authTokens } = useContext(AuthContext);
  const authFetch = useAuthFetch();

  const fetchOrganizations = async () => {
    // We don't need to set isLoading here because the main spinner handles the initial load
    try {
      const response = await authFetch('/api/organizations/');
      const data = await response.json();
      if (response.ok) {
        setOrganizations(data.results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Could not fetch organizations.");
    } finally {
      setIsLoading(false); // Make sure loading is always false after initial fetch
    }
  };

  useEffect(() => {
    if (authTokens) {
      fetchOrganizations();
    }
  }, [authTokens]);

const handleRunScan = async (orgId) => {
    toast.info("Scan initiated..."); // Show an initial message
    try {
        const response = await authFetch('/api/scans/create/', {
            method: 'POST',
            body: JSON.stringify({ organization_id: orgId, user_id: user.user_id }),
        });

        const data = await response.json();

        if (response.ok) {
            // If the scan was successful, show a success message
            toast.success(`Scan complete! New score: ${data.score}%`);
            // CRUCIAL: Re-fetch the organization list to update the UI
            fetchOrganizations(); 
        } else {
            // If the server sent back an error
            toast.error("Scan failed on the server.");
        }
    } catch (error) {
        // If there was a network error
        console.error('Error running scan:', error);
        toast.error('Error running scan. See console for details.');
    }
};

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {user && user.role === 'admin' && <OrganizationForm onOrganizationCreated={fetchOrganizations} />}

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Organizations List</h2>
        
        {isLoading ? (
            <Spinner />
        ) : (
            <div className="org-list">
                {organizations.length > 0 ? (
                    <ul className="space-y-4">
                        {organizations.map(org => (
                            <li key={org.id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <Link to={`/organization/${org.id}`} className="text-lg text-white font-bold hover:text-cyan-400">
                                        {org.name}
                                    </Link>
                                    <p className="text-sm text-gray-400">{org.industry}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="font-bold text-lg">
                                          {org.latest_scan_score !== null && org.latest_scan_score !== 'API Error' && org.latest_scan_score !== 'Network Error'
                                            ? `${org.latest_scan_score}%`
                                            : org.latest_scan_score === 'API Error'
                                              ? 'API Error: Unable to fetch scan result.'
                                              : org.latest_scan_score === 'Network Error'
                                                ? 'Network Error: Please check your connection.'
                                                : 'N/A'}
                                        </p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${getRiskBadgeColor(org.latest_scan_risk)}`}>
                                            {org.latest_scan_risk}
                                        </span>
                                    </div>
                                    {user && user.role === 'admin' && (
                                        <button
                                            onClick={() => handleRunScan(org.id)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded text-sm"
                                        >
                                            Run Scan
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No organizations found.</p>
                )}
            </div>
        )}
      </div>
    </>
  );
}

export default HomePage;