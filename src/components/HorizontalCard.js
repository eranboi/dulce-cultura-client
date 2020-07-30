import React, { Component } from "react";
import "./HorizontalCard.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { removeFromCart } from "../actions";

class HorizontalCard extends Component {
  state = { price: 0 };

  componentDidMount() {
    this.calculateThePrice();
    console.log(this.props.product.id);
  }

  renderCard() {
    const { product } = this.props;

    return (
      <div className="item">
        <div className="ui small image">
          <img
            src={`https://dulcecultura.s3.amazonaws.com/${product.imageURL}`}
          />
        </div>
        <div className="content">
          <a className="header">{product.name}</a>

          <div className="description">{product.description}</div>
          <div className="extra">
            <div
              className="ui right floated basic red button"
              onClick={(e) => {
                e.preventDefault();
                this.props.removeFromCart(this.props.product);
              }}
            >
              Remove
              <i className="right chevron icon"></i>
            </div>
            <div className="ui label">{this.props.product.quantity}</div>
            <div className="ui label">MXN {this.props.product.price}</div>
          </div>
        </div>
      </div>
    );
  }

  calculateThePrice() {
    const price = this.props.product.quantity * this.props.product.price;

    this.setState({ price });
  }

  render() {
    return this.renderCard();
  }
}

export default connect(null, { removeFromCart })(HorizontalCard);
