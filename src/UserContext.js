import React, { createContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        token: null,
        isLoading: true  // Added loading state
    });

    const unsetUser = useCallback(() => {
        localStorage.removeItem('token');
        setUser({
            id: null,
            isAdmin: null,
            token: null,
            isLoading: false
        });
    }, []);

    const retrieveUserDetails = useCallback(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            unsetUser();
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(response.status === 401 ? 'Session expired' : 'Failed to fetch user details');
            }

            const data = await response.json();
            setUser({
                id: data._id,
                isAdmin: data.isAdmin,
                token: token,
                isLoading: false
            });
        } catch (error) {
            console.error('User details fetch error:', error.message);
            if (error.message.includes('Failed to fetch')) {
                console.error('Backend server might be down or unreachable');
            }
            unsetUser();
        }
    }, [unsetUser]);

    useEffect(() => {
        retrieveUserDetails();
    }, [retrieveUserDetails]);

    // Add function to manually set user after login
    const setUserData = useCallback(({ id, isAdmin, token }) => {
        localStorage.setItem('token', token);
        setUser({
            id,
            isAdmin,
            token,
            isLoading: false
        });
    }, []);

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser: setUserData, 
            unsetUser, 
            retrieveUserDetails 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;