const ResponseHandling = async (apiResponse) => {
  return {
    data: apiResponse.data,
    headers: apiResponse.headers,
    status: 200,
  };
};
export default ResponseHandling;
