export default (axios) => ({
  async postOrder(data) {
    return axios.post(`/order/post-order`, data);
  },
  async getOrders() {
    return axios.get("/order/get-orders");
  },
  async getOrder(id) {
    return axios.get(`/order/get-order/${id}`);
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
  async approveOrder(orderId, userId) {
    return axios.get(`/order/approve-order/${orderId}/${userId}`);
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
  async getUserJobs(userId) {
    return axios.get(`/order/get-user-jobs/${userId}`);
  },
  async setJobProgress(data) {
    return axios.post("/order/set-progress", data);
  },
  async setJobCompletion(data) {
    return axios.post("/order/set-job-completion", data);
  },
  async workerAbandonJob(data) {
    return axios.post("/order/worker-abandon-job", data);
  },
  async getJobProgress(userId, orderId) {
    return axios.get(`/order/get-job-progress/${userId}/${orderId}`);
  },
  async isOrderJobActive(orderId) {
    return axios.get(`/order/is-order-job-active/${orderId}`);
  },
  async removeOrder(userId, orderId) {
    return axios.get(`/order/remove-order/${userId}/${orderId}`);
  },
});
