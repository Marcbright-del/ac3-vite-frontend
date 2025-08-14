// src/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import useAuthFetch from '../hooks/useAuthFetch.js';

function UserModal({ isOpen, onClose, onSave, userToEdit }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const authFetch = useAuthFetch();

    const isEditing = userToEdit !== null;

    useEffect(() => {
        if (isEditing) {
            setUsername(userToEdit.username);
            setEmail(userToEdit.email);
            setFirstName(userToEdit.first_name);
            setLastName(userToEdit.last_name);
            setRole(userToEdit.profile.role);
            setPassword(''); // Clear password for security
        } else {
            // Reset form for creating a new user
            setUsername('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setRole('client');
        }
    }, [userToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username, email, first_name: firstName, last_name: lastName,
            profile: { role }
        };

        // Only include the password if it's being set (for a new user or a password change)
        if (password) {
            userData.password = password;
        }

        const url = isEditing ? `/api/users/${userToEdit.id}/` : '/api/users/';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await authFetch(url, {
                method: method,
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                onSave(); // This will refetch the user list and close the modal
            } else {
                const errorData = await response.json();
                alert(`Error: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Failed to save user:", error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Form fields for username, email, etc. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="p-2 rounded bg-gray-700" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="p-2 rounded bg-gray-700" />
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="p-2 rounded bg-gray-700" />
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="p-2 rounded bg-gray-700" />
                    </div>
                    <div className="mb-4">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEditing ? "New Password (optional)" : "Password"} required={!isEditing} className="w-full p-2 rounded bg-gray-700" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 rounded bg-gray-700">
                            <option value="client">Client</option>
                            <option value="auditor">Auditor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserModal;