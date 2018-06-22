import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostList from "./PostList";
import Spinner from "../common/Spinner";
import {
  getPosts,
  getSubscribedPosts,
  getPostsByUser
} from "../../actions/postActions";

class PostFetcher extends Component {
  componentDidMount() {
    const { feedType } = this.props;
    switch (feedType) {
      case "ALL":
        this.props.getPosts();
        break;
      case "SUBSCRIBED":
        this.props.getSubscribedPosts();
        break;
      case "USER":
        if (this.props.user) this.props.getPostsByUser(this.props.user);
        else this.props.history.push("/not-found");
        break;
      default:
        this.props.getPosts();
    }
  }

  render() {
    const { posts, loading } = this.props.post;
    let postContent;

    if (posts === null || loading) {
      postContent = <Spinner />;
    } else {
      postContent = <PostList posts={posts} />;
    }

    return <div>{postContent}</div>;
  }
}

PostFetcher.propTypes = {
  getPosts: PropTypes.func.isRequired,
  getSubscribedPosts: PropTypes.func.isRequired,
  getPostsByUser: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  feedType: PropTypes.string.isRequired,
  user: PropTypes.string
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPosts, getSubscribedPosts, getPostsByUser }
)(PostFetcher);
