import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { token } from "../storage";

interface AuthContextType {
  isAuthenticated: boolean;
  signin: (callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return token.get() !== null;
  });

  const signin = (callback: VoidFunction) => {
    setIsAuthenticated(true);
    callback();
  };
  const signout = (callback: VoidFunction) => {
    setIsAuthenticated(false);
    callback();
  };
  const value = { isAuthenticated, signin, signout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
}

export { AuthProvider, useAuth, RequireAuth };
