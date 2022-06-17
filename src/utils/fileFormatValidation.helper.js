const acceptedFileFormats = ["gltf", "obj", "blend", "fbx", "jpg", "png"];
const acceptedModelFormats = ["gltf", "obj", "blend", "fbx"];
const acceptedImageFormats = ["jpg", "png"];

const FileFormatValidation = {
  isModelFormatsValid: (files) => {
    if (!files || files.length === 0) return false;

    let fileFormats = files.map((file) => {
      return file.filename.split(".")[1];
    });

    fileFormats = [...new Set(fileFormats)];

    const validFileFormats = acceptedFileFormats.filter((x) =>
      fileFormats.includes(x)
    );
    const containsModelFile = acceptedModelFormats.filter((x) =>
      validFileFormats.includes(x)
    );

    if (
      fileFormats.length !== validFileFormats.length ||
      containsModelFile.length === 0
    ) {
      return false;
    } else {
      return true;
    }
  },
  isImageFormatsValid: (images) => {
    if (!images || images.length === 0) return false;

    let imageFormats = images.map((file) => {
      return file.filename.split(".")[1];
    });

    imageFormats = [...new Set(imageFormats)];

    const validFileFormats = acceptedImageFormats.filter((x) =>
      imageFormats.includes(x)
    );

    if (imageFormats.length !== validFileFormats.length) {
      return false;
    } else {
      return true;
    }
  },
  isImageFormatValid: (image) => {
    let imageFormat = image.filename.split(".")[1];

    return acceptedImageFormats.includes(imageFormat);
  },
};

export default FileFormatValidation;
