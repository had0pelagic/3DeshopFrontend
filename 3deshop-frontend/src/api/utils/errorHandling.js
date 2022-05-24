const ErrorHandling = async (apiError, path = "Not given") => {
  let error = {
    status: returnStatus(apiError),
    errorMessage: returnErrorMessage(apiError),
    path,
    error: apiError,
  };

  if (error.status === 400) {
    error.errorMessage = apiError.response.data.Message;
  }

  console.log("Error has been found: ", error);

  return error;
};

const returnErrorMessage = (error) => {
  const errorVal = error.toString();

  if (errorVal.includes("400")) {
    return "Bad request";
  } else if (errorVal.includes("401")) {
    return "Unauthorized";
  } else if (errorVal.includes("403")) {
    return "Forbidden";
  } else if (errorVal.includes("404")) {
    return "Not found";
  } else if (errorVal.includes("405")) {
    return "Method not allowed";
  } else if (errorVal.includes("409")) {
    return "Conflict";
  } else if (errorVal.includes("411")) {
    return "Length required";
  } else if (errorVal.includes("412")) {
    return "Precondition failed";
  } else if (errorVal.includes("429")) {
    return "Too many requests";
  } else if (errorVal.includes("500")) {
    return "Internal server error";
  } else if (errorVal.includes("503")) {
    return "Service unavailable";
  }
};

const returnStatus = (error) => {
  const errorVal = error.toString();

  if (errorVal.includes("400")) {
    return 400;
  } else if (errorVal.includes("401")) {
    return 401;
  } else if (errorVal.includes("403")) {
    return 403;
  } else if (errorVal.includes("404")) {
    return 404;
  } else if (errorVal.includes("405")) {
    return 405;
  } else if (errorVal.includes("409")) {
    return 409;
  } else if (errorVal.includes("411")) {
    return 411;
  } else if (errorVal.includes("412")) {
    return 412;
  } else if (errorVal.includes("429")) {
    return 429;
  } else if (errorVal.includes("500")) {
    return 500;
  } else if (errorVal.includes("503")) {
    return 503;
  }
};

export default ErrorHandling;
