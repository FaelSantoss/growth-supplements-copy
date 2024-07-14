import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  name: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  userLogged : DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLogged, setUserLogged] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserLogged(decodedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    document.cookie = `token=${token}; path=/; SameSite=None; Secure`;
    const decodedToken: DecodedToken = jwtDecode(token);
    setUserLogged(decodedToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure';
    setUserLogged(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
