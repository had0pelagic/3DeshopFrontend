export default (axios) => ({
  async getUserBalance(userId) {
    return await axios.get(`/balance/get-user-balance/${userId}`);
  },
  async payForProduct(data) {
    return await axios.post("/balance/pay-for-product", data);
  },
  async balanceTopUp(data) {
    return await axios.post("/balance/balance-top-up", data);
  },
});
