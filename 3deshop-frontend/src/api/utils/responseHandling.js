const ResponseHandling = async (apiResponse) => {
  return {
    data: apiResponse.data,
    status: 200,
  };
};
export default ResponseHandling;
