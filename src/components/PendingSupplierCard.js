import React, { Component } from "react";

import axios from "../api/axios";

class PendingSupplierCard extends Component {
  onClickApprove = async () => {
    const admin = JSON.parse(localStorage.getItem("user"));
    const token = admin.token;

    // /users/pending/:id
    try {
      const response = await axios.patch(
        `users/pending/approve/${this.props.user._id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.props.onApproveSupplier(this.props.user._id);
    } catch (err) {
      console.log(err.message);
    }
  };

  onClickDecline = async () => {
    const admin = JSON.parse(localStorage.getItem("user"));
    const token = admin.token;

    // /users/pending/:id
    try {
      const response = await axios.patch(
        `users/pending/reject/${this.props.user._id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.props.onApproveSupplier(this.props.user._id);
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    return (
      <div className="card">
        <div className="content">
          <div className="header">{this.props.user.name}</div>
          <div className="meta">{this.props.user.email}</div>
          <div className="description">
            {this.props.user.name} requested permission to sell products
          </div>
        </div>
        <div className="extra content">
          <div className="ui two buttons">
            <div
              className="ui basic green button"
              onClick={this.onClickApprove}
            >
              Approve
            </div>
            <div className="ui basic red button" onClick={this.onClickDecline}>
              Decline
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PendingSupplierCard;
