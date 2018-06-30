import Validator from "validator";
import isEmpty from "./is-empty";

const validatePostInput = data => {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 5, max: 500 })) {
    errors.posttext = "Post must be between 5 and 500 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.posttext = "Text field is required";
  }

  if (!isEmpty(data.video)) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = data.video.match(regExp); // get the YouTube video ID

    if (!match || match[2].length !== 11) {
      errors.video = "Unable to get YouTube video ID";
    }
    if (!Validator.isURL(data.video)) {
      errors.video = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validatePostInput;
