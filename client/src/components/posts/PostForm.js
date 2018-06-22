import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addPost, clearErrors } from "../../actions/postActions";
import isEmpty from "../../validation/is-empty";
import validateFileInput from "../../validation/file";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: "",
      imagePreviewUrl: "",
      errors: {},
      fileError: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
    if (newProps.post.postSuccess) {
      this.setState({
        text: "",
        file: "",
        imagePreviewUrl: ""
      });
      this.fileInput.value = "";
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  onSubmit(e) {
    e.preventDefault();

    const { user, avatar } = this.props.auth;

    let formData = new FormData();
    if (this.state.file) {
      formData.append("image", this.state.file);
    }
    formData.append("text", this.state.text);
    formData.append("username", user.username);
    formData.append("name", user.name);
    formData.append("avatar", avatar);

    this.props.addPost(formData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleImageChange(e) {
    let reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      // validate file: must be image && size < 10MB
      const error = validateFileInput(file);

      if (!isEmpty(error)) {
        this.setState({
          fileError: error,
          file: "",
          imagePreviewUrl: ""
        });
        this.fileInput.value = "";
      } else {
        this.setState({
          fileError: "",
          file: file,
          imagePreviewUrl: reader.result
        });
      }
    };

    reader.readAsDataURL(file);
  }

  render() {
    const { errors, imagePreviewUrl, fileError } = this.state;
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
                <div className="form-group mb-0">
                  <TextAreaFieldGroup
                    placeholder="Create a post"
                    name="text"
                    value={this.state.text}
                    onChange={this.onChange}
                    error={errors.posttext}
                  />
                  <div className="mt-2">
                    <input
                      name="image"
                      type="file"
                      className="fileInput"
                      onChange={e => this.handleImageChange(e)}
                      ref={ref => (this.fileInput = ref)}
                      accept="image/*"
                    />
                    <input
                      type="submit"
                      className="btn btn-info btn-sm float-right"
                      value="Post"
                    />
                  </div>
                </div>
              </form>
              {fileError && <p className="error-font">{fileError}</p>}
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
  { addPost, clearErrors }
)(PostForm);
