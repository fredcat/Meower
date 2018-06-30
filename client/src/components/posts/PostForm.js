import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
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
      videoUrl: "",
      errors: {},
      showPhoto: false,
      showVideo: false,
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

  onPhotoClick() {
    this.setState(prevState => ({
      showPhoto: !prevState.showPhoto,
      showVideo: false,
      videoUrl: ""
    }));
  }

  onVideoClick() {
    this.setState(prevState => ({
      showVideo: !prevState.showVideo,
      showPhoto: false,
      file: "",
      imagePreviewUrl: ""
    }));
  }

  toEmbedUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp); // get the YouTube video ID

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    } else {
      return null;
    }
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
      imagePreviewUrl: "",
      videoUrl: "",
      showPhoto: false,
      showVideo: false
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
    if (this.state.videoUrl) newPost.video = this.state.videoUrl;

    if (this.state.file && this.state.videoUrl)
      return this.props.getErrors({
        file: "Only accept either one photo or one video in one post",
        video: "Only accept either one photo or one video in one post"
      });
    const { errors, isValid } = validatePostInput(newPost);
    if (!isValid) return this.props.getErrors(errors);

    if (this.state.videoUrl)
      newPost.video = this.toEmbedUrl(this.state.videoUrl);

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
    const {
      errors,
      imagePreviewUrl,
      uploading,
      showPhoto,
      showVideo,
      videoUrl
    } = this.state;
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
                  <div className="btn-group postform-buttons" role="group">
                    <button
                      type="button"
                      className={classnames("btn btn-sm font-weight-bold", {
                        "text-muted": !showPhoto,
                        "btn-light": !showPhoto,
                        "btn-primary": showPhoto
                      })}
                      onClick={e => this.onPhotoClick()}
                    >
                      <i class="far fa-image mr-1" />
                      Photo
                    </button>
                    <button
                      type="button"
                      className={classnames("btn btn-sm font-weight-bold", {
                        "text-muted": !showVideo,
                        "btn-light": !showVideo,
                        "btn-primary": showVideo
                      })}
                      onClick={e => this.onVideoClick()}
                    >
                      <i class="fab fa-youtube mr-1" />
                      Video
                    </button>
                  </div>
                </div>
                <div className="col-auto pl-0">
                  <button
                    type="submit"
                    className="btn btn-info btn-sm font-weight-bold post-button"
                  >
                    {uploading ? <ButtonSpinner /> : "Post"}
                  </button>
                </div>
              </div>
              {showPhoto && (
                <div className="mt-1">
                  <input
                    name="file"
                    type="file"
                    onChange={e => this.handleImageChange(e)}
                    ref={ref => (this.fileInput = ref)}
                    accept="image/*"
                    className="file-input"
                  />
                  {errors.file && (
                    <div className="error-font">{errors.file}</div>
                  )}
                  {imagePreviewUrl && (
                    <img
                      className="post-img-preview my-2"
                      src={imagePreviewUrl}
                      alt="preview"
                    />
                  )}
                </div>
              )}
              {showVideo && (
                <div className="mt-1">
                  <InputGroup
                    placeholder="YouTube Video URL"
                    name="videoUrl"
                    icon="fab fa-youtube"
                    value={videoUrl}
                    onChange={this.onChange}
                    error={errors.video}
                    small={true}
                  />
                  {videoUrl &&
                    this.toEmbedUrl(videoUrl) && (
                      <iframe
                        height="150"
                        title="video"
                        src={this.toEmbedUrl(videoUrl)}
                        frameBorder="0"
                        className=" mt-2"
                      />
                    )}
                </div>
              )}
            </form>
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
