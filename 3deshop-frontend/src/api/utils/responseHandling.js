const ResponseHandling = async (apiResponse) => {
  return {
    response: apiResponse.data,
    status: 200,
  };
};
export default ResponseHandling;
