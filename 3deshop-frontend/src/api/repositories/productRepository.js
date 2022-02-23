export default (axios) => ({
  async getProducts() {
    return axios.get("/product");
  },
  async getProduct(id) {
    return axios.get(`/product/${id}`);
  },
});
