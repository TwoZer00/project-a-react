import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { getUserData } from '../firebase/utills';

const UserCacheContext = createContext();

export function UserCacheProvider({ children }) {
    const [users, setUsers] = useState({});
    const pending = useRef({});

    const getUser = useCallback(async (userId) => {
        if (!userId) return undefined;
        if (users[userId]) return users[userId];

        // Deduplicate in-flight requests
        if (!pending.current[userId]) {
            pending.current[userId] = getUserData(userId)
                .then((data) => {
                    setUsers((prev) => ({ ...prev, [userId]: data }));
                    delete pending.current[userId];
                    return data;
                })
                .catch((err) => {
                    delete pending.current[userId];
                    console.error(err);
                    return undefined;
                });
        }
        return pending.current[userId];
    }, [users]);

    return (
        <UserCacheContext.Provider value={{ users, getUser }}>
            {children}
        </UserCacheContext.Provider>
    );
}

export function useUserCache() {
    return useContext(UserCacheContext);
}
