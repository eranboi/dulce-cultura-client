import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

import { signInUser } from "../actions";
import "./Login.css";
import Alert from "../components/Alert";

class Signin extends Component {
  state = { email: "", password: "", error: null };

  componentDidMount() {
    if (this.props.auth.isSignedIn) {
      this.props.history.push("/");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.auth.error !== this.props.auth.error) {
      if (this.props.auth.error) {
        this.setState({ error: this.props.auth.error });
        return console.log(this.state.error);
      }
      this.setState({ error: null });
    }
    if (prevProps.auth.isSignedIn !== this.props.auth.isSignedIn) {
      if (this.props.auth.isSignedIn) {
        const search = this.props.location.search; // could be '?foo=bar'
        if (!_.isEmpty(search)) {
          const params = new URLSearchParams(search);
          const redirect = params.get("redirect"); // bar
          return this.props.history.push(`${redirect}`);
        }
        return this.props.history.push("/");
      }
    }
  }

  OnSignInClick = (e) => {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      this.setState({ error: null });
      this.props.signInUser(this.state.email, this.state.password);
    } else {
      return this.setState({ error: "Please fill the fields!" });
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderError() {
    return <Alert message={this.state.error} className="danger" />;
  }

  renderForm() {
    return (
      <div
        className="ui middle aligned center aligned grid"
        style={{ marginTop: "150px" }}
      >
        <div className="eight wide computer ten wide table sixteen wide mobile column">
          <h2 className="ui teal image header">
            <div className="content">Log-in to your account</div>
          </h2>
          <form className="ui form" style={{ width: "100%" }}>
            <div className="ui tiny segment">
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input
                    type="text"
                    name="email"
                    placeholder="E-mail address"
                    onChange={this.onChange}
                    value={this.state.email}
                  />
                </div>
              </div>

              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.onChange}
                    value={this.state.password}
                  />
                </div>
              </div>
              <div
                className="ui fluid large teal submit button"
                onClick={this.OnSignInClick}
              >
                Login
              </div>
            </div>

            {this.state.error && (
              <div className="ui error message visible">{this.state.error}</div>
            )}
          </form>

          <div className="ui message">
            New to us? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    );
    return (
      <div className="card text-center loginCard align-self-center">
        <div className="card-header">Login</div>
        <div className="card-body">
          <form className="form-signin">
            <div className="row mb-3">
              <div className="col">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                  onChange={this.onChange}
                  value={this.state.email}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={this.onChange}
                  value={this.state.password}
                />
              </div>
            </div>
            <div className="checkbox mb-3"></div>
            {this.state.error && this.renderError()}
            <button
              className="btn btn-lg btn-block login-btn"
              type="submit"
              onClick={this.OnSignInClick}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return this.renderForm();
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, { signInUser })(Signin);
