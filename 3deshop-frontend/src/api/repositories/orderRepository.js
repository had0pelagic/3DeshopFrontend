export default (axios) => ({
  async postOrder(data) {
    return axios.post(`/order/post-order`, data);
  },
  async getOrders() {
    return axios.get(`/order/get-orders`);
  },
  async getOrderOffers(id) {
    return axios.get(`/order/get-order-offers/${id}`);
  },
  async getInactiveOrders() {
    return axios.get(`/order/get-inactive-orders`);
  },
  async getDisplayOrder(id) {
    return axios.get(`/order/get-display-order/${id}`);
  },
  async getUserOrders(id) {
    return axios.get(`/order/get-user-orders/${id}`);
  },
  async postOffer(data) {
    return axios.post(`/order/post-offer`, data);
  },
  async getOffer(id) {
    return axios.get(`/order/get-offer/${id}`);
  },
  async acceptOffer(userId, offerId, orderId) {
    return axios.post(`/order/accept-offer/${userId}/${offerId}/${orderId}`);
  },
  async declineOffer(userId, offerId) {
    return axios.post(`/order/decline-offer/${userId}/${offerId}`);
  },
});
