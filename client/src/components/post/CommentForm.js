import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addComment } from "../../actions/postActions";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {},
      focused: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user, avatar } = this.props.auth;
    const { postId } = this.props;

    const newComment = {
      text: this.state.text,
      username: user.username,
      name: user.name,
      avatar: avatar
    };

    this.props.addComment(postId, newComment).then(success => {
      if (success)
        this.setState({
          text: ""
        });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  render() {
    const { errors, focused } = this.state;
    const { avatar, user } = this.props.auth;
    const { postId } = this.props;

    return (
      <div className="media p-sm-3 p-2 comment-box bg-light">
        <img
          className="rounded-circle d-none d-sm-block comment-avatar mr-3"
          src={avatar}
          alt={user.username}
        />
        <div className="media-body">
          <form onSubmit={this.onSubmit}>
            <TextAreaFieldGroup
              placeholder="Reply to post"
              name="text"
              value={this.state.text}
              onChange={this.onChange}
              error={
                errors.comment &&
                errors.comment.postid === postId &&
                errors.comment.text
              }
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
            {(focused || this.state.text) && (
              <button
                onClick={this.onSubmit}
                className="btn btn-info btn-sm mt-2 float-right"
              >
                Reply
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addComment }
)(CommentForm);
