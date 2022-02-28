export default (axios) => ({
  async getPayment(id) {
    return axios.get(`/payment/${id}`);
  },
  async postPayment(data) {
    return axios.post("/payment", data);
  },
});
