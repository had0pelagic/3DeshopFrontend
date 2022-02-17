// import AsyncStorage from '@react-native-community/async-storage';
// import DynamicTexts from "../constants/texts.constant";

const BasicHelper = {
  defaultHeaders: async (accessToken) => {
    const token = (await localStorage.getItem("jwtToken")) || accessToken;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  },
  errorMessage: (err) => {
    const errData = err.response || err.stack;
    // return DynamicTexts.errorMessage[errData ? errData.status : 'unknown']
    return errData;
  },
  capitalize: (string, capitalizeEach) => {
    const capitalizeSegment = (stringSegment) => {
      return stringSegment.charAt(0).toUpperCase() + stringSegment.slice(1);
    };

    if (capitalizeEach) {
      const segments = string.split(" ");
      return segments
        .map((item) => {
          return capitalizeSegment(item);
        })
        .join(" ");
    } else {
      return capitalizeSegment(string);
    }
  },
  roundToTwo: (num) => {
    return +`${Math.round(`${num}e+2`)}e-2`;
  },
};

export default BasicHelper;
