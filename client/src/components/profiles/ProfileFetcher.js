import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import ProfileItem from "./ProfileItem";
import {
  getProfiles,
  getFollowingsProfiles,
  getFollowersProfiles
} from "../../actions/profileActions";

class ProfileFetcher extends Component {
  componentDidMount() {
    const { feedType } = this.props;
    switch (feedType) {
      case "ALL":
        this.props.getProfiles();
        break;
      case "FOLLOWINGS":
        if (this.props.user) this.props.getFollowingsProfiles(this.props.user);
        else this.props.history.push("/not-found");
        break;
      case "FOLLOWERS":
        if (this.props.user) this.props.getFollowersProfiles(this.props.user);
        else this.props.history.push("/not-found");
        break;
      default:
        this.props.getProfiles();
    }
  }

  render() {
    const { profiles, listLoading } = this.props.profile;

    const { feedType } = this.props;
    let header;

    let profileItems;
    if (profiles === null || listLoading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <ProfileItem
            key={profile._id}
            profile={profile}
            followed={profile.followed}
          />
        ));

        switch (feedType) {
          case "FOLLOWINGS":
            header = (
              <div className="media-body">
                <h6 className="text-center text-primary mt-1">
                  {profiles.length} Followings
                </h6>
              </div>
            );
            break;
          case "FOLLOWERS":
            header = (
              <div className="media-body">
                <h6 className="text-center text-primary mt-1">
                  {profiles.length} Followers
                </h6>
              </div>
            );
            break;
          default:
        }
      } else {
        profileItems = (
          <div className="media-body text-center text-secondary p-5">
            <h4>No Items Found...</h4>
          </div>
        );
      }
    }

    return (
      <div>
        {header}
        {profileItems}
      </div>
    );
  }
}

ProfileFetcher.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  getFollowingsProfiles: PropTypes.func.isRequired,
  getFollowersProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles, getFollowingsProfiles, getFollowersProfiles }
)(ProfileFetcher);
