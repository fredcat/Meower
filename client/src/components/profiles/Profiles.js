import React, { Component } from "react";
import ProfileFetcher from "./ProfileFetcher";

class Profiles extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="profiles pt-4 screen-filled">
        <div className="fixed-width-7 m-auto">
          <div className="card card-body mb-3 p-0">
            <div className="media">
              <div className="media-body">
                <h5 className="text-center text-secondary mt-1">
                  Browse and follow other cat lovers
                </h5>
              </div>
            </div>
            <ProfileFetcher feedType="ALL" />
          </div>
        </div>
      </div>
    );
  }
}

export default Profiles;
