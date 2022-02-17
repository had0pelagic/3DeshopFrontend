export default (axios) => ({
  async getProducts() {
    return axios.get("/product");
  },
});
