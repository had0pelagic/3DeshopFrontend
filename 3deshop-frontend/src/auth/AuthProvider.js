import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

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

  const saveTokenToStorage = async (response) => {
    console.log("saving token to storage");
    await localStorage.setItem("jwtToken", response.token);
    await localStorage.setItem(
      "tokenExpiresInMilliseconds",
      response.expirationDate
    );
    // localStorage.setItem(
    //   "tokenExpiresInMilliseconds",
    //   Date.now() + response.expiresIn * 1000
    // );
  };

  const removeTokenFromStorage = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("tokenExpiresInMilliseconds");
  };

  const handleLogin = async (response) => {
    const origin = location.state?.from?.pathname || "/";
    console.log("AuthProvider.js: %o", response);
    setToken(response.token);
    await saveTokenToStorage(response);
    navigate(origin);
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
