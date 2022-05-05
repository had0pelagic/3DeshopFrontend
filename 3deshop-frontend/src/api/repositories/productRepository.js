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
  async getProductsByGivenIdsAndOrderByPrice(data) {
    return axios.post(`/product/get-products-by-ids-order-by-price`,data);
  },
  async getProductsByGivenIdsAndOrderByDate(data) {
    return axios.post(`/product/get-products-by-ids-order-by-date`,data);
  },
  async getProductsOrderByPrice(ascending) {
    return axios.get(`/product/get-products-order-by-price/${ascending}`);
  },
  async getProductsOrderByUploadDate(ascending) {
    return axios.get(`/product/get-products-order-by-date/${ascending}`);
  },
  async getProductsByGivenCriteria(data) {
    return axios.post("/product/get-products-by-criteria", data);
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
