import React, { Component } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addFollow, removeFollow } from "../../actions/profileActions";
import isEmpty from "../../validation/is-empty";

class PeopleSidebar extends Component {
  onFollowClick(id) {
    this.props.addFollow(true, id);
  }

  onUnfollowClick(id) {
    this.props.removeFollow(true, id);
  }

  render() {
    const { profile, followed, auth } = this.props;

    return (
      <div className="card card-body bg-light">
        <div className="mx-auto mt-2 people-avatar">
          <Link to={`/people/${profile.handle}`}>
            <img
              className="rounded-circle"
              src={profile.user.avatar}
              alt={profile.user.username}
            />
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link to={`/people/${profile.handle}`} className="mt-0">
            <h4 className="name">{profile.user.name}</h4>
            <h6 className="text-muted">@{profile.user.username}</h6>
          </Link>
        </div>

        <div className="text-center my-1">
          {profile.user._id === auth.user.id ? (
            <Link
              to="/edit-profile"
              type="button"
              className="btn btn-info btn-sm font-weight-bold mt-2"
            >
              Edit Profile
            </Link>
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

        <div className="mt-4 text-center text-muted">
          {isEmpty(profile.location) ? null : (
            <p className="mb-2">
              <i className="far fa-compass font-size-6 mr-2" />
              {profile.location}
            </p>
          )}
          <p className="mb-2">
            <i class="far fa-calendar-alt font-size-6 mr-2" />
            {"Joined "}
            <Moment format="MMMM, YYYY">{profile.date}</Moment>
          </p>
          {isEmpty(profile.birthday) ? null : (
            <p className="mb-2">
              <i className="fas fa-birthday-cake font-size-6 mr-2" />
              {"Born on "}
              <Moment format="MMM D, YYYY">{profile.birthday}</Moment>
            </p>
          )}

          <p>
            {isEmpty(profile.website) ? null : (
              <a className="p-2" href={profile.website} target="_blank">
                <i className="fas fa-link fa-2x" />
              </a>
            )}
            {isEmpty(profile.social && profile.social.youtube) ? null : (
              <a className="p-2" href={profile.social.youtube} target="_blank">
                <i className="fab fa-youtube fa-2x" />
              </a>
            )}

            {isEmpty(profile.social && profile.social.twitter) ? null : (
              <a className="p-2" href={profile.social.twitter} target="_blank">
                <i className="fab fa-twitter fa-2x" />
              </a>
            )}

            {isEmpty(profile.social && profile.social.facebook) ? null : (
              <a className="p-2" href={profile.social.facebook} target="_blank">
                <i className="fab fa-facebook fa-2x" />
              </a>
            )}

            {isEmpty(profile.social && profile.social.instagram) ? null : (
              <a
                className="p-2"
                href={profile.social.instagram}
                target="_blank"
              >
                <i className="fab fa-instagram fa-2x" />
              </a>
            )}
          </p>
        </div>

        <div className="pl-2">
          <p>{profile.bio}</p>
        </div>
      </div>
    );
  }
}

PeopleSidebar.propTypes = {
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
)(PeopleSidebar);
