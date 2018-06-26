import React, { Component } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import FollowButton from "../profiles/FollowButton";

class PeopleSidebar extends Component {
  render() {
    const { profile, followed } = this.props;

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
          <FollowButton
            id={profile.user._id}
            inSidebar={true}
            followed={followed}
          />
        </div>

        <div className="mt-4 text-center text-muted">
          {isEmpty(profile.location) ? null : (
            <p className="mb-2">
              <i className="far fa-compass font-size-6 mr-2" />
              {profile.location}
            </p>
          )}
          <p className="mb-2">
            <i className="far fa-calendar-alt font-size-6 mr-2" />
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

export default PeopleSidebar;
