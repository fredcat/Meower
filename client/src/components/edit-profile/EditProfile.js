import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import ButtonSpinner from "../common/ButtonSpinner";
import {
  createProfile,
  getCurrentProfile,
  getErrors,
  clearErrors
} from "../../actions/profileActions";
import { uploadImage, changeAvatar } from "../../actions/authActions";
import isEmpty from "../../validation/is-empty";
import validateFileInput from "../../validation/file";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      gender: "",
      birthday: "",
      location: "",
      website: "",
      bio: "",
      youtube: "",
      twitter: "",
      facebook: "",
      instagram: "",
      errors: {},
      file: "",
      imagePreviewUrl: "",
      uploading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCurrentProfile().then(profile => {
      if (profile) {
        // If profile field doesnt exist, make empty string
        profile.gender = !isEmpty(profile.gender) ? profile.gender : "";
        profile.birthday = !isEmpty(profile.birthday) ? profile.birthday : "";
        profile.location = !isEmpty(profile.location) ? profile.location : "";
        profile.website = !isEmpty(profile.website) ? profile.website : "";
        profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
        profile.social = !isEmpty(profile.social) ? profile.social : {};
        profile.youtube = !isEmpty(profile.social.youtube)
          ? profile.social.youtube
          : "";
        profile.twitter = !isEmpty(profile.social.twitter)
          ? profile.social.twitter
          : "";
        profile.facebook = !isEmpty(profile.social.facebook)
          ? profile.social.facebook
          : "";
        profile.instagram = !isEmpty(profile.social.instagram)
          ? profile.social.instagram
          : "";

        // Set component fields state
        this.setState({
          gender: profile.gender,
          birthday: profile.birthday,
          location: profile.location,
          website: profile.website,
          bio: profile.bio,
          youtube: profile.youtube,
          twitter: profile.twitter,
          facebook: profile.facebook,
          instagram: profile.instagram
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      this.setState({ uploading: false });
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleImageChange(e) {
    let reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      // validate file: must be image && size < 10MB
      const { errors, isValid } = validateFileInput(file);

      if (!isValid) {
        // Clear out file input
        this.props.getErrors(errors);
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

  handleImageSubmit(e) {
    e.preventDefault();

    this.setState({ uploading: true }); // Activate uploading spinner

    if (this.state.file) {
      this.props.uploadImage(this.state.file).then(uploadUrl => {
        if (uploadUrl) {
          this.props.changeAvatar(uploadUrl);
          // clear out
          this.setState({
            file: "",
            imagePreviewUrl: ""
          });
          this.fileInput.value = "";
          this.setState({ uploading: false }); // Terminate uploading spinner
        } else this.props.getErrors({ file: "Failed to upload the image" });
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      gender: this.state.gender,
      birthday: this.state.birthday,
      location: this.state.location,
      website: this.state.website,
      bio: this.state.bio,
      youtube: this.state.youtube,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      instagram: this.state.instagram
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { avatar } = this.props.auth;

    const {
      errors,
      displaySocialInputs,
      imagePreviewUrl,
      uploading
    } = this.state;

    let socialInputs;
    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="YouTube Channel URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />

          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />

          <InputGroup
            placeholder="Facebook Page URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />

          <InputGroup
            placeholder="Instagram Page URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }

    // Select options for gender
    const options = [
      { label: "Select Gender", value: "" },
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Not Specified", value: "Not Specified" }
    ];

    return (
      <div className="edit-profile pt-4 screen-filled">
        <div className="fixed-width-8 m-auto">
          <h1 className="text-center">Edit Profile</h1>
          <div className="card card-body mt-4 mb-5 p-3 bg-light">
            <h5>
              <strong>Change Avatar</strong>
            </h5>
            <div className="row">
              <div className="col-md-5">
                <h6>Current avatar</h6>
                <div className="profile-avatar">
                  <img className="img-thumbnail" src={avatar} alt="avatar" />
                </div>
              </div>
              <div className="col-md-7">
                <h6>Choose an image</h6>
                <form
                  onSubmit={e => this.handleImageSubmit(e)}
                  encType="multipart/form-data"
                >
                  <div>
                    <input
                      name="image"
                      type="file"
                      onChange={e => this.handleImageChange(e)}
                      ref={ref => (this.fileInput = ref)}
                      accept="image/*"
                      className="file-input"
                    />
                    <button
                      type="submit"
                      className="btn btn-dark float-right fixed-width-08"
                    >
                      {uploading ? <ButtonSpinner /> : "Submit"}
                    </button>
                  </div>
                </form>
                {errors.file && <div className="error-font">{errors.file}</div>}
                {imagePreviewUrl && (
                  <img
                    className="post-img-preview mt-2"
                    src={imagePreviewUrl}
                    alt="preview"
                  />
                )}
              </div>
            </div>
          </div>
          <form onSubmit={this.onSubmit}>
            <SelectListGroup
              placeholder="Gender"
              name="gender"
              label="Gender"
              value={this.state.gender}
              onChange={this.onChange}
              options={options}
              error={errors.gender}
            />
            <TextFieldGroup
              name="birthday"
              type="date"
              label="Birthday"
              value={this.state.birthday}
              onChange={this.onChange}
              error={errors.birthday}
            />
            <TextFieldGroup
              placeholder="Location"
              name="location"
              label="Location"
              value={this.state.location}
              onChange={this.onChange}
              error={errors.location}
            />
            <TextFieldGroup
              placeholder="Personal Website"
              name="website"
              label="Website"
              value={this.state.website}
              onChange={this.onChange}
              error={errors.website}
            />
            <TextAreaFieldGroup
              placeholder="Short Bio"
              name="bio"
              label="Bio"
              value={this.state.bio}
              onChange={this.onChange}
              error={errors.bio}
              info="Tell us a little about yourself"
            />

            <div className="mb-3">
              <button
                type="button"
                onClick={() => {
                  this.setState(prevState => ({
                    displaySocialInputs: !prevState.displaySocialInputs
                  }));
                }}
                className="btn btn-light"
              >
                Add Social Network Links
              </button>
              <span className="text-muted"> (Optional)</span>
            </div>
            {socialInputs}
            <input
              type="submit"
              value="Submit"
              className="btn btn-info btn-block mt-4"
            />
          </form>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getErrors: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  changeAvatar: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    createProfile,
    getCurrentProfile,
    getErrors,
    clearErrors,
    uploadImage,
    changeAvatar
  }
)(withRouter(EditProfile));
