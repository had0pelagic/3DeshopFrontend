const FormatHelper = {
  encodeBase64: (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  },
  encodeBase64Bytes: (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        const bytes = fileReader.result.split(",")[1];
        resolve(bytes);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  },
};

export default FormatHelper;
