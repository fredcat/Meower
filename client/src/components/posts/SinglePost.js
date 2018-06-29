import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PostItem from "../post/PostItem";
import Spinner from "../common/Spinner";
import { getPost } from "../../actions/postActions";

class SinglePost extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.post.posts === null || nextProps.post.posts.length < 1) &&
      this.props.post.loading &&
      !nextProps.post.loading
    ) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { posts, loading } = this.props.post;
    let postContent;

    if (posts === null || loading || posts.length < 1) {
      postContent = <Spinner />;
    } else {
      postContent = <PostItem post={posts[0]} steppedInto={true} />;
    }

    return (
      <div className="post pt-sm-4 pt-3 screen-filled">
        <div className="fixed-width-7 m-auto">{postContent}</div>
      </div>
    );
  }
}

SinglePost.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPost }
)(SinglePost);
