import React, { createContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    const isAuth = await client.isAuthenticated();
    setIsAuthenticated(isAuth);

    if (isAuth) {
      const identity = client.getIdentity();
      setIdentity(identity);
    }
  };

  const login = async () => {
    await authClient.login({
      identityProvider: process.env.II_URL,
      onSuccess: () => {
        setIsAuthenticated(true);
        setIdentity(authClient.getIdentity());
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};