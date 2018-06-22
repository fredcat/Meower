import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TimeDisplay from "../common/TimeDisplay";
import { deleteComment } from "../../actions/postActions";

class CommentItem extends Component {
  onDeleteClick(postId, commentId) {
    this.props.deleteComment(postId, commentId);
  }

  render() {
    const { comment, postId, auth } = this.props;

    return (
      <div className="media px-3 py-2 comment-item">
        <Link to={`/people/${comment.username}`}>
          <img
            className="rounded-circle d-none d-md-block comment-avatar mr-3"
            src={comment.avatar}
            alt={comment.username}
          />
        </Link>
        <div className="media-body">
          {comment.user === auth.user.id ? (
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
                  onClick={e => this.onDeleteClick(postId, comment._id)}
                  className="dropdown-item"
                >
                  Delete
                </Link>
              </div>
            </div>
          ) : null}

          <Link to={`/people/${comment.username}`} className="mt-0 mb-1">
            <div className="name font-size-3">{comment.name} </div>
            <div className="text-muted ml-1 d-inline-block font-size-3">
              @{comment.username}
            </div>
          </Link>

          <div className="text-muted font-size-1">
            <TimeDisplay>{comment.date}</TimeDisplay>
          </div>

          <p className="mb-0  font-size-3">{comment.text}</p>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
