export default (axios) => ({
  async getUsers() {
    return await axios.get("/user");
  },
  async getUser(id) {
    return await axios.get(`/user/${id}`);
  },
  async userLogin(data) {
    return await axios.post("/user/authenticate", data);
  },
  async userRegister(data) {
    return await axios.post("/user", data);
  },
  async userUpdate(id, data) {
    return await axios.put(`/user/${id}`, data);
  },
  async userChangePassword(id, data) {
    return await axios.post(`/user/${id}/change-password`, data);
  },
});
