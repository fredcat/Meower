import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearProfile } from "../../actions/profileActions";
import { clearPost } from "../../actions/postActions";
import logo from "../../img/cat-icon.png";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearProfile();
    this.props.clearPost();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user, avatar } = this.props.auth;

    const authLeftLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item" key="home">
          <Link className="nav-link b-border" to="/feed">
            Home
          </Link>
        </li>
        <li className="nav-item" key="discover">
          <Link className="nav-link b-border" to="/profiles">
            Discover
          </Link>
        </li>
      </ul>
    );

    const authRightLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item" key="mypage">
          <Link
            className="nav-link font-size-3"
            to={`/people/${user.username}`}
          >
            {user.name}
          </Link>
        </li>

        <li className="nav-item dropdown" key="dropdown">
          <Link
            className="nav-link dropdown-toggle nav-avatar no-border"
            to="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img className="rounded-circle" src={avatar} alt={user.username} />
          </Link>
          <div className="dropdown-menu pt-2" aria-labelledby="navbarDropdown">
            <Link
              to={`/people/${user.username}`}
              className="dropdown-item py-0 dropdown-header"
            >
              <div className="text-black font-weight-bold font-size-5">
                {user.name}
              </div>
              <div className="text-muted font-size-3">@{user.username}</div>
            </Link>
            <div className="dropdown-divider" />
            <Link to="/edit-profile" className="dropdown-item no-border">
              Edit Profile
            </Link>
            <Link
              to="#"
              onClick={this.onLogoutClick.bind(this)}
              className="dropdown-item no-border"
            >
              Log out
            </Link>
          </div>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item" key="signup">
          <Link className="nav-link b-border" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item" key="login">
          <Link className="nav-link b-border" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-light fixed-top mb-4 navbar-custom">
        <div className="container">
          <Link className="navbar-brand mr-4 ml-2 text-dark" to="/">
            <img src={logo} alt="logo" /> Meower
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            {isAuthenticated && authLeftLinks}
            {isAuthenticated ? authRightLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
  clearPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearProfile, clearPost }
)(Navbar);
