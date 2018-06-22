const fileMaxSize = 10 * 1000 * 1000; // 10MB
const fileTypes = ["jpg", "jpeg", "png", "bmp", "gif"];

module.exports = function validateFileInput(data) {
  const extname = data.name
    .split(".")
    .pop()
    .toLowerCase();
  const filesize = data.size;

  let error = "";

  if (fileTypes.indexOf(extname) < 0) {
    error += "Only accept jpg/png/bmp/gif file.";
  }

  if (filesize > fileMaxSize) {
    error += " File size should not exceed 10MB.";
  }
  return error;
};
