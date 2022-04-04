export default (axios) => ({
  async getFiles(productId, userId) {
    return axios.get(`/file/get-product-files/${productId}/${userId}`);
  },
  async getOrderFiles(orderId, userId) {
    return axios.get(`/file/get-order-files/${orderId}/${userId}`);
  },
});
