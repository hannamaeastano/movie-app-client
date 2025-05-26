// src/UserContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        token: null
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null, isAdmin: null, token: null });
    };

    const retrieveUserDetails = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser({
                        id: data._id,
                        isAdmin: data.isAdmin,
                        token: token
                    });
                } else {
                    console.error('Failed to retrieve user details:', data.message);
                    unsetUser();
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                unsetUser();
            }
        } else {
            unsetUser();
        }
    }, []); // Empty dependency array because we only want to create this function once

    useEffect(() => {
        retrieveUserDetails();
    }, [retrieveUserDetails]); // Now we include retrieveUserDetails in the dependencies

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser, retrieveUserDetails }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;