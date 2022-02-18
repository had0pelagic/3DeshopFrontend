export default (axios) => ({
  async getUsers() {
    return axios.get("/user");
  },
  async userLogin(data) {
    return axios.post("/user/authenticate", data);
  },
  async userRegister(data) {
    return axios.post("/user", data);
  },
});
