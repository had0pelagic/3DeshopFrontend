const DownloadHelper = {
  getFileData: (response) => {
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
