export default (axios) => ({
  async getPayment(id) {
    return axios.get(`/payment/get-product-payment/${id}`);
  },
  async postPayment(data) {
    return axios.post("/payment/pay-for-product", data);
  },
  async getOrderPayment(id) {
    return axios.get(`/payment/get-order-payment/${id}`);
  },
  async postOrderPayment(data) {
    return axios.post("/payment/pay-for-order", data);
  },
});
