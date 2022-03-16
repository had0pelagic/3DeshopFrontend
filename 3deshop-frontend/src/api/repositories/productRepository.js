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
    return axios.post("/product/upload-product", data);
  },
  async downloadImage(id) {
    return axios.getBlob(`/product/download/${id}`);
  },
});
