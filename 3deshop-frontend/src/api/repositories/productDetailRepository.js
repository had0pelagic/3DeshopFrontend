export default (axios) => ({
  async getCategories() {
    return axios.get(`/productdetail/get-categories`);
  },
  async getFormats() {
    return axios.get("/productdetail/get-formats");
  },
});
