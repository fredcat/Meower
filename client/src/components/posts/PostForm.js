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
      <div className="mb-4">
        <div className="card card-body p-0 bg-light post-box">
          <div className="media pt-3 pb-2 px-3">
            <img
              className="rounded-circle d-none d-md-block comment-avatar mr-3"
              src={avatar}
              alt={user.username}
            />
            <div className="media-body">
              <form onSubmit={this.onSubmit} encType="multipart/form-data">
                <div className="mb-0">
                  <TextAreaFieldGroup
                    placeholder="Create a post"
                    name="text"
                    value={this.state.text}
                    onChange={this.onChange}
                    error={errors.posttext}
                  />
                  <div className="mt-2">
                    <div className="form-group d-inline-block">
                      <input
                        name="image"
                        type="file"
                        onChange={e => this.handleImageChange(e)}
                        ref={ref => (this.fileInput = ref)}
                        accept="image/*"
                      />
                      {errors.file && (
                        <div className="error-font">{errors.file}</div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-info btn-sm float-right"
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
