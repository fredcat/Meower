import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deletePost, addLike, removeLike } from "../../actions/postActions";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import TimeDisplay from "../common/TimeDisplay";

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayComments: props.steppedInto
    };
  }

  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }

  onUnlikeClick(id) {
    this.props.removeLike(id);
  }

  onCommentClick() {
    this.setState(prevState => ({
      displayComments: !prevState.displayComments
    }));
  }

  render() {
    const { post, auth, steppedInto } = this.props;
    const { displayComments } = this.state;

    return (
      <div className="card card-body mb-3 p-0">
        <div className="media px-3 pt-3 pb-1">
          <Link to={`/people/${post.username}`}>
            <img
              className="rounded-circle d-none d-md-block post-avatar mr-3"
              src={post.avatar}
              alt={post.username}
            />
          </Link>
          <div className="media-body">
            {post.user === auth.user.id ? (
              <div className="dropdown float-right">
                <Link
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  className="upright-button"
                >
                  <i className="fas fa-angle-down" />
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link
                    to="#"
                    onClick={e => this.onDeleteClick(post._id)}
                    className="dropdown-item"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            ) : null}

            <Link to={`/people/${post.username}`}>
              <div className="mt-0 name">{post.name} </div>
              <div className="text-muted mt-0 ml-1 d-inline-block">
                @{post.username}
              </div>
            </Link>

            <div className="text-muted font-size-2 mb-1">
              <TimeDisplay>{post.date}</TimeDisplay>
            </div>

            <p className="mb-2">{post.text}</p>
            {post.image && (
              <div className="post-image">
                <img className="rounded" src={post.image} alt="postimage" />
              </div>
            )}

            <div className="btn-group post-buttons" role="group">
              <button
                onClick={
                  post.liked
                    ? e => this.onUnlikeClick(post._id)
                    : e => this.onLikeClick(post._id)
                }
                type="button"
                className={classnames("btn btn-light like-button", {
                  "text-info": post.liked
                })}
              >
                <i className="fas fa-thumbs-up mr-1" />
                <span className="badge">{post.likes.length}</span>
              </button>

              <button
                onClick={e => this.onCommentClick()}
                type="button"
                className={classnames("btn btn-light comment-button", {
                  "text-success": displayComments
                })}
              >
                <i className="far fa-comment mr-1" />
                <span className="badge">{post.comments.length}</span>
              </button>
            </div>
          </div>
        </div>

        {displayComments && (
          <div>
            <CommentForm postId={post._id} />
            <CommentList postId={post._id} comments={post.comments} />
            {!steppedInto && (
              <div className="media comment-item">
                <Link
                  to={`/post/${post._id}`}
                  className="mx-auto my-1 step-into-link"
                  target="_blank"
                >
                  View in New Page >
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike }
)(PostItem);
