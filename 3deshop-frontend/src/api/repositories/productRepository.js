export default (axios) => ({
  async getProducts() {
    return axios.get("/product");
  },
  async getUserProducts(id) {
    return axios.get(`/product/user-products/${id}`);
  },
  async getProductByName(name) {
    return axios.get(`/product/get-products-by-name/${name}`);
  },
  async getProduct(id) {
    return axios.get(`/product/${id}`);
  },
  async getPurchasedProducts(id) {
    return axios.get(`/product/${id}/purchases`);
  },
  async uploadProduct(data) {
    return axios.post("/product/upload-product", data);
  },
});
