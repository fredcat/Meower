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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validatePostInput;