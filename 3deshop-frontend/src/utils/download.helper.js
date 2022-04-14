const DownloadHelper = {
  getFileData: (response) => {
    // const name = response.headers["content-disposition"]
    //   .split(";")[1]
    //   .split("filename=")[1];
    // const blob = new Blob([response.data]);
    // const url = URL.createObjectURL(blob);
    // return {
    //   url: url,
    //   filename: name,
    // };
    // const b64toBlob = (base64, type = 'application/octet-stream') =>
    // fetch(`data:${response.contentType};base64,${response.fileContents}`).then(res => res.blob())

    var binary_string = window.atob(response.fileContents);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    const name = response.fileDownloadName;
    const date = response.lastModified;
    const blob = new Blob([bytes.buffer], {
      type: response.contentType,
    });
    const url = URL.createObjectURL(blob);
    
    return {
      url: url,
      filename: name,
      date: date,
    };
  },
};

export default DownloadHelper;
