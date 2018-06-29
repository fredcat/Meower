import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import ButtonSpinner from "../common/ButtonSpinner";
import {
  addPost,
  clearErrors,
  getErrors,
  uploadImage
} from "../../actions/postActions";
import validateFileInput from "../../validation/file";
import validatePostInput from "../../validation/post";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: "",
      imagePreviewUrl: "",
      errors: {},
      uploading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
      this.setState({ uploading: false }); // Terminate uploading spinner
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleImageChange(e) {
    let reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      // validate file: must be image && size < 10MB
      const { errors, isValid } = validateFileInput(file);

      if (!isValid) {
        this.props.getErrors(errors);
        // clear out file input
        this.setState({
          file: "",
          imagePreviewUrl: ""
        });
        this.fileInput.value = "";
      } else {
        this.props.clearErrors();
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }
    };

    reader.readAsDataURL(file);
  }

  clearForm() {
    this.setState({
      text: "",
      file: "",
      imagePreviewUrl: ""
    });
    this.fileInput.value = "";
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ uploading: true }); // Activate uploading spinner

    const { user, avatar } = this.props.auth;

    const newPost = {
      text: this.state.text,
      username: user.username,
      name: user.name,
      avatar: avatar
    };
    const { errors, isValid } = validatePostInput(newPost);
    if (!isValid) return this.props.getErrors(errors);

    if (this.state.file) {
      this.props.uploadImage(this.state.file).then(uploadUrl => {
        if (uploadUrl) {
          newPost.image = uploadUrl;
          this.props.addPost(newPost).then(success => {
            this.setState({ uploading: false }); // Terminate uploading spinner
            if (success) this.clearForm();
          });
        } else this.props.getErrors({ file: "Failed to upload the image" });
      });
    } else {
      this.props.addPost(newPost).then(success => {
        this.setState({ uploading: false }); // Terminate uploading spinner
        if (success) this.clearForm();
      });
    }
  }

  render() {
    const { errors, imagePreviewUrl, uploading } = this.state;
    const { user, avatar } = this.props.auth;

    return (
      <div className="card card-body p-0 mb-sm-4 mb-3 bg-light post-box">
        <div className="media pt-3 pb-2 px-sm-3 px-2">
          <img
            className="rounded-circle d-none d-sm-block comment-avatar mr-3"
            src={avatar}
            alt={user.username}
          />
          <div className="media-body">
            <form className="mb-0" onSubmit={this.onSubmit}>
              <TextAreaFieldGroup
                placeholder="Create a post"
                name="text"
                value={this.state.text}
                onChange={this.onChange}
                error={errors.posttext}
              />
              <div className="row mt-2">
                <div className="col pr-0">
                  <input
                    name="image"
                    type="file"
                    onChange={e => this.handleImageChange(e)}
                    ref={ref => (this.fileInput = ref)}
                    accept="image/*"
                    className="file-input"
                  />
                  {errors.file && (
                    <div className="error-font">{errors.file}</div>
                  )}
                </div>
                <div className="col-auto pl-0">
                  <button
                    type="submit"
                    className="btn btn-info btn-sm post-button"
                  >
                    {uploading ? <ButtonSpinner /> : "Post"}
                  </button>
                </div>
              </div>
            </form>

            {imagePreviewUrl && (
              <img
                className="post-img-preview my-2"
                src={imagePreviewUrl}
                alt="preview"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getErrors: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  post: state.post
});

export default connect(
  mapStateToProps,
  { addPost, clearErrors, getErrors, uploadImage }
)(PostForm);
