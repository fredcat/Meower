import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import FollowButton from "./FollowButton";

class ProfileItem extends Component {
  render() {
    const { profile, followed } = this.props;

    return (
      <div className="media px-sm-3 px-2 py-2 comment-item">
        <Link to={`/people/${profile.handle}`}>
          <img
            className="rounded-circle post-avatar mr-sm-3 mr-2"
            src={profile.user.avatar}
            alt={profile.user.username}
          />
        </Link>
        <div className="media-body">
          <div className="row">
            <div className="col pr-1 pr-sm-3">
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
            <div className="col-auto text-center pl-1 pl-sm-3">
              <FollowButton
                id={profile.user._id}
                inSidebar={false}
                followed={followed}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
