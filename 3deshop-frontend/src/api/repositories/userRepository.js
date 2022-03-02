export default (axios) => ({
  async getUsers() {
    return axios.get("/user");
  },
  async getUser(id) {
    return axios.get(`/user/${id}`);
  },
  async userLogin(data) {
    return axios.post("/user/authenticate", data);
  },
  async userRegister(data) {
    return axios.post("/user", data);
  },
  async userUpdate(id, data) {
    return axios.put(`/user/${id}`, data);
  },
  async userChangePassword(id, data) {
    return axios.post(`/user/${id}/change-password`, data);
  },
});
