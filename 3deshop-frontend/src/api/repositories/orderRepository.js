export default (axios) => ({
  async getUserCompletedJobCount(id) {
    return await axios.get(`/order/get-user-completed-job-count/${id}`);
  },
  async postOrder(data) {
    return await axios.post(`/order/post-order`, data);
  },
  async getOrders() {
    return await axios.get("/order/get-orders");
  },
  async getOrder(id) {
    return await axios.get(`/order/get-order/${id}`);
  },
  async getOrderOffers(id) {
    return await axios.get(`/order/get-order-offers/${id}`);
  },
  async getInactiveOrders() {
    return await axios.get(`/order/get-inactive-orders`);
  },
  async getDisplayOrder(id) {
    return await axios.get(`/order/get-display-order/${id}`);
  },
  async getUserOrders(id) {
    return await axios.get(`/order/get-user-orders/${id}`);
  },
  async approveOrder(orderId, userId) {
    return await axios.get(`/order/approve-order/${orderId}/${userId}`);
  },
  async postOffer(data) {
    return await axios.post(`/order/post-offer`, data);
  },
  async getOffer(id) {
    return await axios.get(`/order/get-offer/${id}`);
  },
  async acceptOffer(userId, offerId, orderId) {
    return await axios.post(
      `/order/accept-offer/${userId}/${offerId}/${orderId}`
    );
  },
  async declineOffer(userId, offerId) {
    return await axios.post(`/order/decline-offer/${userId}/${offerId}`);
  },
  async getUserJobs(userId) {
    return await axios.get(`/order/get-user-jobs/${userId}`);
  },
  async setJobProgress(data) {
    return await axios.post("/order/set-progress", data);
  },
  async setJobCompletion(data) {
    return await axios.post("/order/set-job-completion", data);
  },
  async workerAbandonJob(data) {
    return await axios.post("/order/worker-abandon-job", data);
  },
  async getJobProgress(userId, orderId) {
    return await axios.get(`/order/get-job-progress/${userId}/${orderId}`);
  },
  async isOrderJobActive(orderId) {
    return await axios.get(`/order/is-order-job-active/${orderId}`);
  },
  async requestJobChanges(data) {
    return await axios.post(`/order/request-job-changes`, data);
  },
  async removeOrder(userId, orderId) {
    return await axios.get(`/order/remove-order/${userId}/${orderId}`);
  },
  async isOrderOwner(userId, orderId) {
    return await axios.get(`/order/is-order-owner/${userId}/${orderId}`);
  },
});
