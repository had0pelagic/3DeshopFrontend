export default (axios) => ({
  async changeProductStatus(id) {
    return await axios.get(`/product/change-product-status/${id}`);
  },
  async getProducts() {
    return await axios.get("/product");
  },
  async getUserProducts(id) {
    return await axios.get(`/product/user-products/${id}`);
  },
  async getProductByName(name) {
    return await axios.get(`/product/get-products-by-name/${name}`);
  },
  async getProductsByGivenIdsAndOrderByPrice(data) {
    return await axios.post(
      `/product/get-products-by-ids-order-by-price`,
      data
    );
  },
  async getProductsByGivenIdsAndOrderByDate(data) {
    return await axios.post(`/product/get-products-by-ids-order-by-date`, data);
  },
  async getProductsOrderByPrice(ascending) {
    return await axios.get(`/product/get-products-order-by-price/${ascending}`);
  },
  async getProductsOrderByUploadDate(ascending) {
    return await axios.get(`/product/get-products-order-by-date/${ascending}`);
  },
  async getProductsByGivenCriteria(data) {
    return await axios.post("/product/get-products-by-criteria", data);
  },
  async getProduct(id) {
    return await axios.get(`/product/${id}`);
  },
  async getPurchasedProducts(id) {
    return await axios.get(`/product/${id}/purchases`);
  },
  async uploadProduct(data) {
    return await axios.post("/product/upload-product", data);
  },
});
