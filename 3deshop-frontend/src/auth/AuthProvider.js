import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("1658d4abisoeiiujqwoiyurqonbllnlasd"), 250);
  });

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);

    const origin = location.state?.from?.pathname || "/login";
    navigate(origin);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
