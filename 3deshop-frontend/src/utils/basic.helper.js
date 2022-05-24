const BasicHelper = {
  defaultHeaders: async (accessToken) => {
    const token = (await localStorage.getItem("jwtToken")) || accessToken;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  },
  errorMessage: (err) => {
    return err.response || err.stack;
  },
};

export default BasicHelper;
