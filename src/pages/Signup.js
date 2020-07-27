import React, { Component } from "react";
import { connect } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import _ from "lodash";
import { Link } from "react-router-dom";
import { signUp } from "../actions";
import Alert from "../components/Alert";
import Terms from "../components/Terms";

class Signup extends Component {
  state = {
    name: "",
    password: "",
    address: "",
    email: "",
    phone: "",
    error: null,
    showTerms: false,
  };

  onDismissModal = () => {
    this.setState({ showTerms: false });
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    if (this.props.auth.isSignedIn) this.props.history.push("/");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.auth.error !== this.props.auth.error) {
      if (this.props.auth.error) {
        this.setState({ error: this.props.auth.error });
        return console.log(this.state.error);
      }
      this.setState({ error: null });
      this.props.history.push("/");
    }
    if (prevProps.auth.isSignedIn !== this.props.auth.isSignedIn) {
      if (this.props.auth.isSignedIn) {
        this.props.history.push("/");
      }
    }
  }

  onSignUpClick = async (e) => {
    e.preventDefault();
    const { name, password, address, email, phone } = this.state;
    const userInfo = { name, password, address, email, phone };

    if (
      !_.isEmpty(name) &&
      !_.isEmpty(password) &&
      !_.isEmpty(email) &&
      !_.isEmpty(phone) &&
      !_.isEmpty(address)
    )
      this.props.signUp(userInfo);
    else {
      this.setState({ error: "Please fill all the fields!" });
    }
  };

  onSignUpClick_supplier = async (e) => {
    e.preventDefault();
    const { name, password, address, email, phone } = this.state;
    const userInfo = {
      name,
      password,
      address,
      email,
      phone,
      role: "supplier",
      status: "pending",
    };

    if (
      !_.isEmpty(name) &&
      !_.isEmpty(password) &&
      !_.isEmpty(email) &&
      !_.isEmpty(phone) &&
      !_.isEmpty(address)
    )
      this.props.signUp(userInfo);
    else {
      this.setState({ error: "Please fill all the fields!" });
    }
  };

  /* 
  renderSemantic = () => {
    return (
      <div className="ui placeholder segment">
        <div className="ui two column very relaxed stackable grid">
          <div className="column">
            <div className="ui form">
              <div className="field">
                <label>Username</label>
                <div className="ui left icon input">
                  <input type="text" placeholder="Username" />
                  <i className="user icon"></i>
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="ui left icon input">
                  <input type="password" />
                  <i className="lock icon"></i>
                </div>
              </div>
              <div className="ui blue submit button">Login</div>
            </div>
          </div>
          <div className="middle aligned column">
            <div className="ui big button">
              <i className="signup icon"></i>
              Sign Up
            </div>
          </div>
        </div>
        <div className="ui vertical divider">Or</div>
      </div>
    );
  };
*/

  renderCard() {
    return (
      <>
        {this.state.showTerms && <Terms onDismiss={this.onDismissModal} />}
        <div
          className="ui middle aligned center aligned grid"
          style={{ marginTop: "150px" }}
        >
          <div className="eight wide computer ten wide table sixteen wide mobile column">
            <h2 className="ui teal image header">
              <div className="content">Signup</div>
            </h2>
            <form className="ui form" style={{ width: "100%" }}>
              <div className="ui tiny segment">
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                    <input
                      type="text"
                      value={this.state.name}
                      onChange={this.onChange}
                      placeholder="Name"
                      name="name"
                    />
                  </div>
                </div>

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

                <div className="field">
                  <div className="ui left icon input">
                    <i class="address card outline icon"></i>
                    <input
                      value={this.state.address}
                      onChange={this.onChange}
                      type="text"
                      name="address"
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="ui left icon input">
                    <i className="lock icon"></i>
                    <PhoneInput
                      country={"mx"}
                      value={this.state.phone}
                      onChange={(phone) => this.setState({ phone })}
                      inputStyle={{ width: "92.5%", marginLeft: "25px" }}
                    />
                  </div>
                </div>

                <div className="ui two buttons">
                  <div
                    className="ui fluid large teal submit button"
                    onClick={this.onSignUpClick}
                  >
                    Signup
                  </div>
                  <div
                    className="ui fluid basic large orange submit button"
                    onClick={this.onSignUpClick_supplier}
                  >
                    Apply as a supplier
                  </div>
                </div>

                <div>
                  By signing up you agree with our{" "}
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ showTerms: true });
                    }}
                  >
                    Terms and Conditions
                  </Link>
                </div>
              </div>

              {this.state.error && (
                <div className="ui error message visible">
                  {this.state.error}
                </div>
              )}
            </form>

            <div className="ui message">
              <Link to="/signin">Sign In</Link> instead
            </div>
          </div>
        </div>
      </>
    );
  }

  render() {
    return this.renderCard();
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { signUp })(Signup);
