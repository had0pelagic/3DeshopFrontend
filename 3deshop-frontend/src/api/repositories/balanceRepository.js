export default (axios) => ({
  async getUserBalance(userId) {
    return axios.get(`/balance/get-user-balance/${userId}`);
  },
  async payForProduct(data) {
    return axios.post("/balance/pay-for-product", data);
  },
  async balanceTopUp(data) {
    return axios.post("/balance/balance-top-up", data);
  },
});
