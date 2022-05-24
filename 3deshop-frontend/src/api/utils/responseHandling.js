const ResponseHandling = async (apiResponse) => {
  return {
    status: 200,
    data: apiResponse.data,
    headers: apiResponse.headers,
  };
};
export default ResponseHandling;
