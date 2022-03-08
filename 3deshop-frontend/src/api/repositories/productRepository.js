export default (axios) => ({
  async getProducts() {
    return axios.get("/product");
  },
  async getProduct(id) {
    return axios.get(`/product/${id}`);
  },
  async getPurchasedProducts(id) {
    return axios.get(`/product/${id}/purchases`);
  },
  async uploadProduct(data) {
    console.log(data);
    return axios.post("/product/upload-product", data);
  },
});
