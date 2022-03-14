const FormatHelper = {
  encodeBase64: (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        const fileData = fileReader.result.split(",");
        resolve({
          type: fileData[0],
          bytes: fileData[1],
          full: fileReader.result,
        });
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  },
};

export default FormatHelper;
