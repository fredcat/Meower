import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import classnames from "classnames";
import PostForm from "./PostForm";
import PostFetcher from "./PostFetcher";

class PostFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabname: "all"
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.location.pathname === "/feed/subscribed")
      this.setState({ tabname: "subscribed" });
    else if (this.props.location.pathname === "/feed/all")
      this.setState({ tabname: "all" });
  }

  render() {
    return (
      <div className="feed mt-sm-4 mt-3 screen-filled">
        <div className="fixed-width-7 m-auto">
          <PostForm />
          <nav className="navbar navbar-expand navbar-light mb-2 p-0 postfeed-nav font-size-3">
            <div>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link
                    className={classnames("nav-link", {
                      active: this.state.tabname === "all"
                    })}
                    to="/feed/all"
                    onClick={e => this.setState({ tabname: "all" })}
                  >
                    All
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={classnames("nav-link", {
                      active: this.state.tabname === "subscribed"
                    })}
                    to="/feed/subscribed"
                    onClick={e => this.setState({ tabname: "subscribed" })}
                  >
                    Subscirbed
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <Route
            exact
            path="/feed"
            render={props => <PostFetcher {...props} feedType="ALL" />}
          />
          <Route
            exact
            path="/feed/all"
            render={props => <PostFetcher {...props} feedType="ALL" />}
          />
          <Route
            exact
            path="/feed/subscribed"
            render={props => <PostFetcher {...props} feedType="SUBSCRIBED" />}
          />
        </div>
      </div>
    );
  }
}

export default PostFeed;
