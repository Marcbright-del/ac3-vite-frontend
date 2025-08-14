import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useAuthFetch = () => {
    const { authTokens, logoutUser, API_BASE_URL } = useContext(AuthContext);

    const authFetch = async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`; // Construct the full URL

        const headers = {
            'Authorization': `Bearer ${authTokens.access}`,
            ...options.headers,
        };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            ...options,
            headers: headers,
        });

        if (response.status === 401) {
            logoutUser();
        }

        return response;
    };

    return authFetch;
};

export default useAuthFetch;