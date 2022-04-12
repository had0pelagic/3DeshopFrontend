const ErrorHandling = async (apiError, path = "Not given") => {
  let error = {
    errorMessage: getErrorMessage(apiError),
    status: getStatus(apiError),
    path,
    error: apiError,
  };

  if (error.status === 400) {
    error.errorMessage = apiError.response.data.Message;
  }

  console.log("Error", error);
  
  return error;
};

const getStatus = (error) => {
  const errorText = error.toString();
  if (errorText.includes("400")) {
    return 400;
  } else if (errorText.includes("401")) {
    return 401;
  } else if (errorText.includes("403")) {
    return 403;
  } else if (errorText.includes("404")) {
    return 404;
  } else if (errorText.includes("405")) {
    return 405;
  } else if (errorText.includes("409")) {
    return 409;
  } else if (errorText.includes("411")) {
    return 411;
  } else if (errorText.includes("412")) {
    return 412;
  } else if (errorText.includes("429")) {
    return 429;
  } else if (errorText.includes("500")) {
    return 500;
  } else if (errorText.includes("503")) {
    return 503;
  }
};

const getErrorMessage = (error) => {
  const errorText = error.toString();
  if (errorText.includes("400")) {
    return "Bad Request";
  } else if (errorText.includes("401")) {
    return "Unauthorized";
  } else if (errorText.includes("403")) {
    return "Forbidden";
  } else if (errorText.includes("404")) {
    return "Not Found";
  } else if (errorText.includes("405")) {
    return "Method Not Allowed";
  } else if (errorText.includes("409")) {
    return "Conflict";
  } else if (errorText.includes("411")) {
    return "Length Required";
  } else if (errorText.includes("412")) {
    return "Precondition Failed";
  } else if (errorText.includes("429")) {
    return "Too Many Requests";
  } else if (errorText.includes("500")) {
    return "Internal Server Error";
  } else if (errorText.includes("503")) {
    return "Service Unavailable";
  }
};
export default ErrorHandling;
