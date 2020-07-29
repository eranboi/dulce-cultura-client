import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Card.css";

class Card extends Component {
  state = { quantity: 1, currentUserId: null };

  handleChange = (e) => {
    this.setState({ quantity: e.target.value });
  };

  onClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const product = {
      name: this.props.name,
      price: this.props.price,
      imageURL: this.props.images[0].imageURL,
      id: this.props.id,
      description: this.props.description,
      quantity: this.state.quantity,
    };

    if (user) {
      if (user.user._id != this.props.user._id) {
        this.props.AddToCart(product);
        this.props.toast();
      } else {
        this.props.toastOwnItem();
      }
    } else {
      this.props.AddToCart(product);
      this.props.toast();
    }
  };

  renderImage = () => {
    if (this.props.images.length == 1) {
      return (
        <div className="ui fluid image" href="#">
          {!this.props.available && (
            <div className="ui red ribbon label">Not Available</div>
          )}
          {this.props.available && (
            <div className="ui teal ribbon label">Available</div>
          )}

          <img
            src={`https://dulcecultura.s3.amazonaws.com/${this.props.images[0].imageURL}`}
            alt={this.props.name}
          />
        </div>
      );
    } else if (this.props.images.length == 2) {
      return (
        <div class="ui slide masked reveal image">
          {!this.props.available && (
            <div className="ui red ribbon label">Not Available</div>
          )}
          {this.props.available && (
            <div className="ui teal ribbon label">Available</div>
          )}
          <img
            src={`https://dulcecultura.s3.amazonaws.com/${this.props.images[0].imageURL}`}
            class="visible content"
          />
          <img
            src={`https://dulcecultura.s3.amazonaws.com/${this.props.images[1].imageURL}`}
            class="hidden content"
          />
        </div>
      );
    }
  };

  renderSemanticCard = () => {
    return (
      <div className="ui card">
        {this.renderImage()}

        <div className="content">
          <div className="ui orange tag floating right label">
            MXN{this.props.price}
          </div>
          <Link className="header" to={`/products/${this.props.id}`}>
            {this.props.name}
          </Link>
        </div>

        <div className="extra content">
          <div className="ui form">
            <div className="two fields">
              <div className="field">
                <select
                  className="ui compact dropdown"
                  name="quantity"
                  value={this.state.quantity}
                  onChange={this.handleChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div className="field">
                <button
                  className="ui fluid basic green button"
                  disabled={!this.props.available}
                  onClick={this.onClick}
                >
                  <i className="cart plus icon"></i>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return this.renderSemanticCard();
  }
}

export default Card;
