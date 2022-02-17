export default (axios) => ({
  async getUsers() {
    return axios.get("/user");
  },
});
