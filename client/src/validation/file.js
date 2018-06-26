import isEmpty from "./is-empty";
const fileMaxSize = 10 * 1000 * 1000; // 10MB
const fileTypes = ["jpg", "jpeg", "png", "bmp", "gif"];

const validateFileInput = data => {
  const extname = data.name
    .split(".")
    .pop()
    .toLowerCase();
  const filesize = data.size;

  let errors = {};

  if (filesize > fileMaxSize) {
    errors.file = "File size should not exceed 10MB.";
  }

  if (fileTypes.indexOf(extname) < 0) {
    errors.file = "Only accept jpg/png/bmp/gif file. ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateFileInput;
