const ErrorHelper = {
  returnErrorMessage: (error) => {
    if (error.includes("Error: Network Error")) {
      return "API network error";
    } else if (error.includes("400")) {
      return "Bad request";
    } else if (error.includes("401")) {
      return "Unauthorized";
    } else if (error.includes("402")) {
      return "Payment required";
    } else if (error.includes("403")) {
      return "Forbidden";
    } else if (error.includes("404")) {
      return "Not found";
    } else if (error.includes("405")) {
      return "Method not allowed";
    } else if (error.includes("406")) {
      return "Not acceptable";
    } else if (error.includes("408")) {
      return "Request timeout";
    } else if (error.includes("409")) {
      return "Conflict";
    } else if (error.includes("411")) {
      return "Length required";
    } else if (error.includes("412")) {
      return "Precondition failed";
    } else if (error.includes("413")) {
      return "Payload too large";
    } else if (error.includes("415")) {
      return "Unsupported media type";
    } else if (error.includes("429")) {
      return "Too many requests";
    } else if (error.includes("500")) {
      return "Internal server error";
    } else if (error.includes("503")) {
      return "Service unavailable";
    }
  },
  returnErrorStatus: (error) => {
    if (error.includes("400")) {
      return 400;
    } else if (error.includes("401")) {
      return 401;
    } else if (error.includes("402")) {
      return 402;
    } else if (error.includes("403")) {
      return 403;
    } else if (error.includes("404")) {
      return 404;
    } else if (error.includes("405")) {
      return 405;
    } else if (error.includes("406")) {
      return 406;
    } else if (error.includes("408")) {
      return 408;
    } else if (error.includes("409")) {
      return 409;
    } else if (error.includes("411")) {
      return 411;
    } else if (error.includes("412")) {
      return 412;
    } else if (error.includes("413")) {
      return 413;
    } else if (error.includes("415")) {
      return 415;
    } else if (error.includes("429")) {
      return 429;
    } else if (error.includes("500")) {
      return 500;
    } else if (error.includes("503")) {
      return 503;
    }
  },
};

export default ErrorHelper;
