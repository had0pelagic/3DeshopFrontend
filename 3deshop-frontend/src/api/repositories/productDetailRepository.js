export default (axios) => ({
  async getCategories() {
    return await axios.get(`/productdetail/get-categories`);
  },
  async getFormats() {
    return await axios.get("/productdetail/get-formats");
  },
});
