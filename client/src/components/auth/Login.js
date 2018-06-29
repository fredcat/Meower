import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import ButtonSpinner from "../common/ButtonSpinner";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/feed");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      if (
        nextProps.auth.user.role === "NO_PROFILE_USER" ||
        nextProps.auth.user.role === "NEW_USER"
      )
        this.props.history.push("/edit-profile");
      else this.props.history.push("/feed");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      this.setState({ loading: false }); // Terminate loading spinner
    }
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ loading: true }); // Activate loading spinner

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, loading } = this.state;

    return (
      <div className="login landing">
        <div className="dark-overlay">
          <div className="container pt-5">
            <div className="row">
              <div className="col-md-1" />
              <div className="fixed-width-4 text-white">
                <h1 className="display-4 text-center ">Log In</h1>
                <p className="lead text-center">
                  Sign in to your Meower account
                </p>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Email Address"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />

                  <TextFieldGroup
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <button type="submit" className="btn btn-info btn-block mt-4">
                    {loading ? <ButtonSpinner /> : "Log in"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(
    mapStateToProps,
    { loginUser }
  )(Login)
);
