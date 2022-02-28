import axios from "axios";
import config from "../config/config";
import userRepository from "./repositories/userRepository";
import productRepository from "./repositories/productRepository";
import commentRepository from "./repositories/commentRepository";
import paymentRepository from "./repositories/paymentRepository";
import basicHelper from "../utils/basic.helper";
import errorHandling from "./utils/errorHandling";
import responseHandling from "./utils/responseHandling";

const axiosInstance = axios.create({
  baseURL: config.baseUrl,
});

const axiosPaymentInstance = axios.create({
  baseURL: config.paymentUrl,
});

const axiosMiddleware = {
  get: async (path, token) => {
    const config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosInstance
      .get(path, config)
      .then(async function (response) {
        return responseHandling(response);
      })
      .catch(async function (error) {
        return errorHandling(error, path);
      });
  },

  getDefault: async (path, token) => {
    const config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosInstance.get(path, config);
  },

  post: async (path, data, token) => {
    const config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosInstance
      .post(path, data, config)
      .then(async function (response) {
        return responseHandling(response);
      })
      .catch(async function (error) {
        return errorHandling(error, path);
      });
  },

  postDefault: async (path, data, token) => {
    let config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosInstance.post(path, data, config);
  },
};

const axiosPaymentMiddleware = {
  get: async (path, token) => {
    const config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosPaymentInstance
      .get(path, config)
      .then(async function (response) {
        return responseHandling(response);
      })
      .catch(async function (error) {
        return errorHandling(error, path);
      });
  },

  getDefault: async (path, token) => {
    const config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosPaymentInstance.get(path, config);
  },

  post: async (path, data, token) => {
    const config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosPaymentInstance
      .post(path, data, config)
      .then(async function (response) {
        return responseHandling(response);
      })
      .catch(async function (error) {
        return errorHandling(error, path);
      });
  },

  postDefault: async (path, data, token) => {
    let config = {
      headers: await basicHelper.defaultHeaders(token),
    };
    return axiosPaymentInstance.post(path, data, config);
  },
};

const repositories = {
  users: userRepository(axiosMiddleware),
  products: productRepository(axiosMiddleware),
  comments: commentRepository(axiosMiddleware),
  payments: paymentRepository(axiosPaymentMiddleware),
};

export default { ...repositories };
