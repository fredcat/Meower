import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";
import PeopleSidebar from "./PeopleSidebar";
import PostFetcher from "../posts/PostFetcher";
import ProfileFetcher from "../profiles/ProfileFetcher";
import Spinner from "../common/Spinner";
import { getProfileByHandle } from "../../actions/profileActions";

class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabname: "posts"
    };
  }

  setTabName(pathname) {
    if (
      /^\/people\/[^/]+\/posts$/.test(pathname) ||
      /^\/people\/[^/]+$/.test(pathname)
    )
      this.setState({ tabname: "posts" });
    else if (/^\/people\/[^/]+\/followings$/.test(pathname))
      this.setState({ tabname: "followings" });
    else if (/^\/people\/[^/]+\/followers$/.test(pathname))
      this.setState({ tabname: "followers" });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
    this.setTabName(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    // re-mount when handle changes
    if (this.props.match.params.handle !== nextProps.match.params.handle) {
      window.scrollTo(0, 0);
      this.props.getProfileByHandle(nextProps.match.params.handle);
      this.setTabName(nextProps.location.pathname);
    }

    // redirect to not-found if no profile found
    if (
      nextProps.profile.profile === null &&
      this.props.profile.loading &&
      !nextProps.profile.loading
    ) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    const handle = this.props.match.params.handle;

    let profileSidebar;
    let main;

    if (profile === null || loading) {
      profileSidebar = <Spinner />;
    } else {
      profileSidebar = (
        <PeopleSidebar profile={profile} followed={profile.followed} />
      );
      const user = profile.user._id;
      main = (
        <div>
          <Route
            exact
            path="/people/:handle/"
            render={props => (
              <PostFetcher {...props} feedType="USER" user={user} />
            )}
          />
          <Route
            exact
            path="/people/:handle/posts"
            render={props => (
              <PostFetcher {...props} feedType="USER" user={user} />
            )}
          />
          <Route
            exact
            path="/people/:handle/followings"
            render={props => (
              <div className="card card-body mb-3 p-0">
                <ProfileFetcher {...props} feedType="FOLLOWINGS" user={user} />
              </div>
            )}
          />
          <Route
            exact
            path="/people/:handle/followers"
            render={props => (
              <div className="card card-body mb-3 p-0">
                <ProfileFetcher {...props} feedType="FOLLOWERS" user={user} />
              </div>
            )}
          />
        </div>
      );
    }

    return (
      <div className="people d-flex pt-4 screen-filled">
        <div className="fixed-width-3_5 d-none d-md-block">
          {profileSidebar}
        </div>

        <div className="fixed-width-7">
          <nav className="navbar navbar-expand-sm navbar-light mb-2 p-0 postfeed-nav font-size-3">
            <div>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link
                    className={classnames("nav-link", {
                      active: this.state.tabname === "posts"
                    })}
                    to={`/people/${handle}/posts`}
                    onClick={e => this.setState({ tabname: "posts" })}
                  >
                    Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={classnames("nav-link", {
                      active: this.state.tabname === "followings"
                    })}
                    to={`/people/${handle}/followings`}
                    onClick={e => this.setState({ tabname: "followings" })}
                  >
                    Followings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={classnames("nav-link", {
                      active: this.state.tabname === "followers"
                    })}
                    to={`/people/${handle}/followers`}
                    onClick={e => this.setState({ tabname: "followers" })}
                  >
                    Followers
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {main}
        </div>
      </div>
    );
  }
}

People.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  post: state.post
});

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(People);
