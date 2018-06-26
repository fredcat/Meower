import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addFollow, removeFollow } from "../../actions/profileActions";
import ButtonSpinner from "../common/ButtonSpinner";

class FollowButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      mouseOut: true
    };
  }

  onFollowClick(inSidebar, id) {
    this.setState({ uploading: true }); // Activate uploading spinner
    this.props.addFollow(inSidebar, id).then(() =>
      this.setState({
        uploading: false, // Terminate uploading spinner
        mouseOut: false // Freeze the text and color of UNFOLLOW button until mouse moves out for the first time
        // (Avoid triggering hover effect immediately after changing to UNFOLLOW.
        // Mouse still hovers on the button after clicking)
      })
    );
  }

  onUnfollowClick(inSidebar, id) {
    this.setState({ uploading: true });
    this.props
      .removeFollow(inSidebar, id)
      .then(() => this.setState({ uploading: false, mouseOut: false }));
  }

  render() {
    const { id, followed, inSidebar, auth } = this.props;
    const { uploading, mouseOut } = this.state;

    // if this profile item belongs to the current user
    // then replace follow/unfollow button with edit-profile button
    if (id === auth.user.id)
      return inSidebar ? (
        <button
          onClick={e => this.props.history.push("/edit-profile")}
          type="button"
          className="btn btn-info btn-sm font-weight-bold mt-2"
        >
          Edit Profile
        </button>
      ) : (
        <div className="dropdown float-right">
          <Link
            to="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            className="upright-button"
          >
            <i className="fas fa-angle-down" />
          </Link>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to="/edit-profile" className="dropdown-item">
              Edit Profile
            </Link>
          </div>
        </div>
      );
    else
      return followed ? (
        // have followed => UNFOLLOW button
        <button
          onClick={e => this.onUnfollowClick(inSidebar, id)}
          type="button"
          className={classnames("btn btn-sm unfollow-button mt-2", {
            uploading: uploading,
            mouseOut: mouseOut
          })}
          // After the mouse moves out of the button for the first time,
          // the button will change color and text on hover
          onMouseOut={e => this.setState({ mouseOut: true })}
        >
          {uploading ? (
            <ButtonSpinner />
          ) : (
            <div>
              <span className="unfollow">Unfollow</span>
              <span className="following">Following</span>
            </div>
          )}
        </button>
      ) : (
        <button
          onClick={e => this.onFollowClick(inSidebar, id)}
          type="button"
          className="btn btn-sm follow-button mt-2"
        >
          {uploading ? <ButtonSpinner /> : "Follow"}
        </button>
      );
  }
}

FollowButton.propTypes = {
  id: PropTypes.string.isRequired,
  inSidebar: PropTypes.bool.isRequired,
  followed: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
  addFollow: PropTypes.func.isRequired,
  removeFollow: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addFollow, removeFollow }
)(withRouter(FollowButton));
