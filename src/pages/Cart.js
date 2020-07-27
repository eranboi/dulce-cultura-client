import React, { Component } from "react";
import { connect } from "react-redux";
import HorizontalCard from "../components/HorizontalCard";
import { removeFromCart } from "../actions";
import _ from "lodash";
import swal from "sweetalert";

import Checkout from "./Checkout";
import "./Checkout.css";

class Cart extends Component {
  state = { totalPrice: 0, checkoutMode: false, canPay: false };

  componentDidMount = () => {
    this.calculateTotalPrice();
    if (_.isEmpty(this.props.cart)) this.setState({ canPay: false });
    else this.setState({ canPay: true });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cart != prevProps.cart) {
      this.calculateTotalPrice();
      if (_.isEmpty(this.props.cart)) {
        return this.setState({ canPay: false });
      }
    }
  }

  calculateTotalPrice = () => {
    let price = 0;
    this.props.cart.map((product) => {
      price += product.price * product.quantity;
    });

    this.setState({ totalPrice: price.toFixed(2) });
  };

  renderProducts = () => {
    return this.props.cart.map((product) => {
      return <HorizontalCard key={product.id} product={product} />;
    });
  };

  renderCheckoutColumn = () => {
    return (
      <div className="card">
        <div className="content">
          <div className="header mt-3 ui center aligned">Checkout</div>
          <div className="description mt-3 ui center aligned header">
            ${this.state.totalPrice}
          </div>
        </div>
        <button
          className="ui bottom attached green button mt-3"
          disabled={!this.state.canPay}
          onClick={() => {
            if (this.state.canPay) {
              if (!this.props.auth.isSignedIn)
                swal("You have to sign in first!", "", "error").then(
                  (value) => {
                    this.props.history.push(`/signin?redirect=/cart`);
                  }
                );
              this.setState({ checkoutMode: true });
            }
          }}
        >
          <i className="add icon"></i>
          Finish Payment
        </button>
      </div>
    );
    return (
      <div className="card text-white bg-dark" style={{ maxWidth: "18rem" }}>
        <div className="card-header">Checkout</div>
        <div className="card-body">
          <h5 className="card-title">${this.state.totalPrice}</h5>
          <button
            disabled={!this.state.canPay}
            onClick={() => {
              if (this.state.canPay) {
                if (!this.props.auth.isSignedIn)
                  swal("You have to sign in first!", "", "error").then(
                    (value) => {
                      this.props.history.push(`/signin?redirect=/cart`);
                    }
                  );
                this.setState({ checkoutMode: true });
              }
            }}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    );
  };

  onOutsideClick = () => {
    this.setState({ checkoutMode: false });
  };

  render() {
    return (
      <div className="ui container mt-5">
        <div className="ui two column stackable grid mt-5">
          <div className="ten wide column mt-5">
            <div className="ui relaxed divided items">
              {this.renderProducts()}
            </div>
          </div>
          <div className="six wide column mt-5">
            {this.renderCheckoutColumn()}
          </div>
        </div>
        {this.state.checkoutMode && (
          <Checkout
            onOutsideClick={this.onOutsideClick}
            totalAmount={this.state.totalPrice}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { cart: state.cart, auth: state.auth };
};

export default connect(mapStateToProps, { removeFromCart })(Cart);
