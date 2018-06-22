import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addFollow, removeFollow } from "../../actions/profileActions";
import isEmpty from "../../validation/is-empty";

class ProfileItem extends Component {
  onFollowClick(id) {
    this.props.addFollow(false, id);
  }

  onUnfollowClick(id) {
    this.props.removeFollow(false, id);
  }

  render() {
    const { profile, followed, auth } = this.props;

    return (
      <div className="media px-3 py-2 comment-item">
        <Link to={`/people/${profile.handle}`}>
          <img
            className="rounded-circle d-none d-md-block post-avatar mr-3"
            src={profile.user.avatar}
            alt={profile.user.username}
          />
        </Link>
        <div className="media-body">
          <div className="row">
            <div className="col-9">
              <Link to={`/people/${profile.handle}`} className="mt-0">
                <h6 className="name">{profile.user.name} </h6>
                <h6 className="text-muted ml-1 d-inline-block">
                  @{profile.user.username}
                </h6>
              </Link>

              {isEmpty(profile.location) ? null : (
                <p className="mb-1 text-secondary">
                  <i className="far fa-compass font-size-6 mr-2" />
                  {profile.location}
                </p>
              )}

              {isEmpty(profile.bio) ? null : (
                <p className="mb-1">{profile.bio}</p>
              )}
            </div>
            <div className="col-3 text-center">
              {profile.user._id === auth.user.id ? (
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
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/edit-profile" className="dropdown-item">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              ) : followed ? (
                <button
                  onClick={e => this.onUnfollowClick(profile.user._id)}
                  type="button"
                  className="btn btn-sm unfollow-button mt-2"
                >
                  <span className="unfollow">Unfollow</span>
                  <span className="following">Following</span>
                </button>
              ) : (
                <button
                  onClick={e => this.onFollowClick(profile.user._id)}
                  type="button"
                  className="btn btn-sm follow-button mt-2"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  addFollow: PropTypes.func.isRequired,
  removeFollow: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addFollow, removeFollow }
)(ProfileItem);
