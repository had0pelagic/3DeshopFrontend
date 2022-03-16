const DownloadHelper = {
  getFileData: (response) => {
    const name = response.headers["content-disposition"]
      .split(";")[1]
      .split("filename=")[1];
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    return {
      url: url,
      filename: name,
    };
  },
};

export default DownloadHelper;
