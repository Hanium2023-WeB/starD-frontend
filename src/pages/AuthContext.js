import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios
            .get("/api/current-member", {
                withCredentials: true,
            })
            .then((res) => {
                setIsLoggedIn(res.data !== 'anonymousUser');
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
