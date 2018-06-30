const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 5, max: 500 })) {
    errors.posttext = "Post must be between 5 and 500 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.posttext = "Text field is required";
  }

  if (!isEmpty(data.image) && !isEmpty(data.video)) {
    errors.file = "Only accept either one photo or one video in one post";
    errors.videoUrl = "Only accept either one photo or one video in one post";
  }

  if (!isEmpty(data.video)) {
    if (!/^https:\/\/www.youtube.com\/embed\/[^#&?]{11}$/.test(data.video))
      errors.video = "Not a valid YouTube embed URL";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
