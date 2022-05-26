export default (axios) => ({
  async getFiles(productId, userId) {
    return await axios.get(`/file/get-product-files/${productId}/${userId}`);
  },
  async getOrderFiles(orderId, userId) {
    return await axios.get(`/file/get-order-files/${orderId}/${userId}`);
  },
});
