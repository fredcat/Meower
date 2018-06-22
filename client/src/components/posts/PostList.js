import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "../post/PostItem";

class PostList extends Component {
  render() {
    const { posts } = this.props;

    if (posts.length > 0) {
      return posts.map(post => (
        <PostItem key={post._id} post={post} steppedInto={false} />
      ));
    } else {
      return (
        <div className="card card-body text-center text-secondary p-5">
          <h5>No Posts Yet...</h5>
        </div>
      );
    }
  }
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostList;
