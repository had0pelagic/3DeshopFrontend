const MainHelper = {
  jwtHeader: async (enterToken) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const jwtToken = await localStorage.getItem("jwtToken");
    const token = jwtToken || enterToken;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  },
};

export default MainHelper;
