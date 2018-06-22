const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(id, data) {
  let errors = { comment: { postid: id } };

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 5, max: 500 })) {
    errors.comment.text = "Comment must be between 5 and 500 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.comment.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors.comment.text)
  };
};
