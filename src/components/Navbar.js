import React, { Component } from "react";
import { Link } from "react-router-dom";

import { signOut } from "../actions";
import { connect } from "react-redux";

class Navbar extends Component {
  state = { itemAmount: 0 };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cart !== this.props.cart) {
      const totalAmount = this.props.cart.length;
      this.setState({ itemAmount: totalAmount });
    }
  }

  componentDidMount() {
    const totalAmount = this.props.cart.length;
    this.setState({ itemAmount: totalAmount });
  }

  onSignOutHandler = () => {
    this.props.signOut();
  };

  renderAdmin = () => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link onClick={this.onSignOutHandler} className="nav-link" to="#">
            Sign Out
          </Link>
        </li>
        <li className="nav-item my-auto">
          <Link className="nav-link" to="/cart">
            <i className="shopping cart icon large"></i>
            <div className="ui red circular label tiny">
              {this.state.itemAmount}
            </div>
          </Link>
        </li>
      </ul>
    );
  };

  renderSupplier = () => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link onClick={this.onSignOutHandler} className="nav-link" to="#">
            Sign Out
          </Link>
        </li>
        <li className="nav-item my-auto">
          <Link className="nav-link" to="/cart">
            <i className="shopping cart icon large"></i>
            <div className="ui red circular label tiny">
              {this.state.itemAmount}
            </div>
          </Link>
        </li>
      </ul>
    );
  };

  renderUser = () => {
    return (
      <ul className="navbar-nav ml-auto ">
        {/* <li className="nav-item">
          <Link className="nav-link" to="#">
            About Us
          </Link>
        </li> */}
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link onClick={this.onSignOutHandler} className="nav-link" to="#">
            Sign Out
          </Link>
        </li>
        <li className="nav-item my-auto">
          <Link className="nav-link" to="/cart">
            <i className="shopping cart icon large"></i>
            <div className="ui red circular label tiny">
              {this.state.itemAmount}
            </div>
          </Link>
        </li>
      </ul>
    );
  };

  renderNotLoggedIn = () => {
    return (
      <ul className="navbar-nav ml-auto">
        {/* <li className="nav-item">
          <Link className="nav-link" to="#">
            About Us
          </Link>
        </li> */}
        <li className="nav-item">
          <Link className="nav-link" to="/signin">
            Sign-in
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            Sign-up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/cart">
            <i className="shopping cart icon large"></i>
            <div className="ui red circular label tiny">
              {this.state.itemAmount}
            </div>
          </Link>
        </li>
      </ul>
    );
  };

  render() {
    const { isSignedIn, user } = this.props.auth;
    return (
      <nav
        className="navbar navbar-expand-md fixed-top navbar-light bg-light"
        style={{ zIndex: "100!important" }}
      >
        <div className="container-bs">
          <Link className="navbar-brand" to="/">
            Shop
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse " id="collapsibleNavbar">
            {isSignedIn &&
              user.user.role == "supplier" &&
              this.renderSupplier()}
            {isSignedIn && user.user.role == "user" && this.renderUser()}
            {isSignedIn && user.user.role == "admin" && this.renderAdmin()}
            {!isSignedIn && this.renderNotLoggedIn()}
          </div>
        </div>
      </nav>
    );
  }

  amountOfCartItems = () => {};
}

const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps, { signOut })(Navbar);
