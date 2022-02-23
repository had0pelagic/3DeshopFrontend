export default (axios) => ({
  async getComments(id) {
    return axios.get(`/comment/${id}`);
  },
});
