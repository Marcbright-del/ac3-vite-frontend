import React, { useState } from 'react';
import useAuthFetch from '../hooks/useAuthFetch';

function OrganizationForm({ onOrganizationCreated }) {
  const authFetch = useAuthFetch(); // Initialize the hook
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [regNo, setRegNo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser form submission

    const newOrganization = {
      name: name,
      industry: industry,
      registration_no: regNo,
    };

    // Send a POST request to the Django API
    try {
            const response = await authFetch('/api/organizations/', {
                method: 'POST',
                body: JSON.stringify(newOrganization),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Successfully created:', data);
                // ... (clear form and notify parent) ...
                 // Clear form fields
            setName('');
            setIndustry('');
            setRegNo('');

            onOrganizationCreated();
        } else {
            console.error('Failed to create organization');
            }
        } catch (error) {
             console.error('Error creating organization:', error);
        }
    };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">Add New Organization</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organization Name"
          required
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Industry"
          required
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          placeholder="Registration No."
          required
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>
      <button type="submit" className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
        Add Organization
      </button>
    </form>
  );
}

export default OrganizationForm;