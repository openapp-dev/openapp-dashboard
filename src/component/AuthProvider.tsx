import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { token } from "../storage";

interface AuthContextType {
  user: string;
  isAuthenticated: boolean;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = useState<string>(null!);
  let [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  let signin = (newUser: string, callback: VoidFunction) => {
    setUser(newUser);
    setIsAuthenticated(true);
    callback();
  };
  let signout = (callback: VoidFunction) => {
    setUser(null!);
    setIsAuthenticated(false);
    callback();
  };
  let value = { user, isAuthenticated, signin, signout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();
  const authToken = token.get();

  if (auth.isAuthenticated) {
    return children;
  }
  if (authToken) {
    auth.signin("openapp", () => {});
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
}

export { AuthProvider, useAuth, RequireAuth };
