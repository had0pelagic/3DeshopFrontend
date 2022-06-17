export default (axios) => ({
  async getComments(id) {
    return await axios.get(`/comment/${id}`);
  },
  async postComment(productId, userId, data) {
    return await axios.post(
      `/comment/post-comment/${productId}/${userId}`,
      data
    );
  },
});
