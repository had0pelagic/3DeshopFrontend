import axios from "axios";
import config from "../config/config";
import userRepository from "./repositories/userRepository";
import productRepository from "./repositories/productRepository";
import commentRepository from "./repositories/commentRepository";
import productDetailRepository from "./repositories/productDetailRepository";
import MainHelper from "../utils/main.helper";
import fileRepository from "./repositories/fileRepository";
import orderRepository from "./repositories/orderRepository";
import balanceRepository from "./repositories/balanceRepository";
import ErrorHelper from "../utils/error.helper";

const handleError = (caughtError, path = "Unavailable") => {
  const error = {
    error: caughtError,
    path,
    errorMessage: ErrorHelper.returnErrorMessage(caughtError.toString()),
    status: ErrorHelper.returnErrorStatus(caughtError.toString()),
  };
  
  if (error.status === 400) {
    error.errorMessage = caughtError.response.data.Message;
  }

  return error;
};

const handleResponse = async (response) => {
  return {
    status: 200,
    data: response.data,
    headers: response.headers,
  };
};

const instance = axios.create({
  baseURL: config.apiURL,
});

const middleware = {
  get: async (path, token) => {
    const config = {
      headers: await MainHelper.jwtHeader(token),
    };

    return instance
      .get(path, config)
      .then(async function (response) {
        return handleResponse(response);
      })
      .catch(async function (error) {
        return handleError(error, path);
      });
  },

  post: async (path, data, token) => {
    const config = {
      headers: await MainHelper.jwtHeader(token),
    };

    return instance
      .post(path, data, config)
      .then(async function (response) {
        return handleResponse(response);
      })
      .catch(async function (error) {
        return handleError(error, path);
      });
  },

  put: async (path, data, token) => {
    const config = {
      headers: await MainHelper.jwtHeader(token),
    };

    return instance
      .put(path, data, config)
      .then(async function (response) {
        return handleResponse(response);
      })
      .catch(async function (error) {
        return handleError(error, path);
      });
  },
};

const repositories = {
  users: userRepository(middleware),
  products: productRepository(middleware),
  comments: commentRepository(middleware),
  productDetails: productDetailRepository(middleware),
  balance: balanceRepository(middleware),
  files: fileRepository(middleware),
  orders: orderRepository(middleware),
};

export default { ...repositories };
