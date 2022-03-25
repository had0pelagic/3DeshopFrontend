export default (axios) => ({
  async postOrder(data) {
    return axios.post(`/order/post-order`, data);
  },
  async getOrders() {
    return axios.get(`/order/get-orders`);
  },
  async getDisplayOrder(id) {
    return axios.get(`/order/get-display-order/${id}`);
  },
  async postOffer(data) {
    return axios.post(`/order/post-offer`, data);
  },
});
