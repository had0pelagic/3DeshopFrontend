import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const fakeAuth = () => {
  return { data: "nojauthkeytokenjwt123", expiresIn: 10 };
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState({ data: null, expiresIn: null });

  useEffect(() => {
    setToken(getToken());
  }, []);

  function getToken() {
    const tokenData = localStorage.getItem("jwtToken");
    const tokenExpire = localStorage.getItem("tokenExpiresInMilliseconds");
    return { data: tokenData, expiresIn: tokenExpire };
  }

  const saveTokenToStorage = (response) => {
    console.log("saving token to storage");
    localStorage.setItem("jwtToken", response.data);
    localStorage.setItem("tokenExpiresInMilliseconds", response.expiresIn);
    // localStorage.setItem(
    //   "tokenExpiresInMilliseconds",
    //   Date.now() + response.expiresIn * 1000
    // );
  };

  const removeTokenFromStorage = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("tokenExpiresInMilliseconds");
  };

  const handleLogin = async () => {
    const token = /*await*/ fakeAuth();
    const origin = location.state?.from?.pathname || "/";
    setToken(token);
    navigate(origin);
    saveTokenToStorage(token);
  };

  const handleLogout = () => {
    const origin = location.state?.from?.pathname || "/";
    removeTokenFromStorage();
    setToken(null);
    navigate(origin);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    getToken: getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
