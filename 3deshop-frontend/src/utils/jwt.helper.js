import jwt from "jwt-decode";

const userJwtScheme = {
  userId:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  userName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  userRole: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};

const JwtHelper = {
  getUser: (token) => {
    const decoded = jwt(token);
    return {
      userId: decoded[userJwtScheme.userId],
      userName: decoded[userJwtScheme.userName],
      userRole: decoded[userJwtScheme.userRole],
    };
  },
};

export default JwtHelper;
