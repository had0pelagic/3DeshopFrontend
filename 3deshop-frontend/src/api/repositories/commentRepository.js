export default (axios) => ({
  async getComments(id) {
    return axios.get(`/comment/${id}`);
  },
  async postComment(productId, userId, data) {
    return axios.post(`/comment/post-comment/${productId}/${userId}`, data);
  },
});
