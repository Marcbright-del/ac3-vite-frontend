// src/pages/UserManagementPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import useAuthFetch from '../hooks/useAuthFetch.js';
import UserModal from '../components/UserModal.jsx';

function UserManagementPage() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const authFetch = useAuthFetch();

    const fetchUsers = async () => {
        try {
            const response = await authFetch('/api/users/');
            const data = await response.json();
            if (response.ok) {
                // This is the corrected line
                setUsers(data); 
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        if (user.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (userToEdit) => {
        setEditingUser(userToEdit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = () => {
        fetchUsers();
        handleCloseModal();
    };

    if (user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
    <>
        <UserModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onSave={handleSaveUser}
            userToEdit={editingUser}
        />
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">User Management</h2>
                <button onClick={handleOpenAddModal} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
                    Add New User
                </button>
            </div>
            
            {/* --- Mobile View (hidden on medium screens and up) --- */}
            <div className="space-y-4 md:hidden">
                {Array.isArray(users) && users.map(u => (
                    <div key={u.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">{u.username}</p>
                            <span className="capitalize text-sm bg-gray-600 px-2 py-0.5 rounded-full">{u.profile.role}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{u.email || 'N/A'}</p>
                        <div className="text-right mt-2">
                            <button onClick={() => handleOpenEditModal(u)} className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Desktop Table (hidden on small screens) --- */}
            <table className="w-full text-left hidden md:table">
                <thead className="border-b-2 border-gray-700">
                    <tr>
                        <th className="p-2">Username</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.map(u => (
                        <tr key={u.id} className="border-b border-gray-700/50">
                            <td className="p-2">{u.username}</td>
                            <td className="p-2">{u.email || 'N/A'}</td>
                            <td className="p-2 capitalize">{u.profile.role}</td>
                            <td className="p-2">
                                <button onClick={() => handleOpenEditModal(u)} className="text-indigo-400 hover:text-indigo-300">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
);
}

export default UserManagementPage;