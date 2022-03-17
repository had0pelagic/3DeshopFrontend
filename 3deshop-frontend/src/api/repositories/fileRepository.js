export default (axios) => ({
  async getFiles(productId, userId) {
    return axios.get(`/file/get-files/${productId}/${userId}`);
  },
});
