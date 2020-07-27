import React, { Component } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import axios from "../api/axios";
import { connect } from "react-redux";
import { clearCart } from "../actions";
import Alert from "./Alert";

class CheckoutModal extends Component {
  state = {
    succeeded: false,
    error: null,
    processing: "",
    disabled: true,
    clientSecret: "",
    order: {},
  };

  componentDidMount = async () => {
    if (this.props.cart) {
      try {
        const response = await axios.post("/payment/create-payment-intent", {
          items: this.props.cart,
        });
        this.setState({ clientSecret: response.data.clientSecret });
      } catch (err) {
        console.log(err.response);

        this.setState({
          error: "There was an error. Please refresh and try again!",
        });
      }
    }

    let products = [];

    this.props.cart.map((product, i) => {
      const productObj = {
        product: product.id,
        quantity: product.quantity,
      };
      products.push(productObj);

      if (i + 1 === this.props.cart.length) {
        this.setState({ order: { products } });
      }
    });

    this.setState({
      order: { ...this.state.order, totalAmount: this.props.totalAmount },
    });
    const { stripe, elements } = this.props;
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  };

  handleChange = async (event) => {
    this.setState({ disabled: event.empty });
    this.setState({ error: event.error ? event.error.message : "" });
  };

  handleSubmit = async (e) => {
    const { stripe, elements } = this.props;
    e.preventDefault();

    this.setState({ processing: true });

    const cardElement = elements.getElement(CardElement);

    const payload = await stripe.confirmCardPayment(this.state.clientSecret, {
      receipt_email: this.props.auth.user.user.email,
      payment_method: {
        card: cardElement,
        billing_details: {
          name: this.props.auth.user.user.name,
        },
      },
    });
    if (payload.error) {
      this.setState({ error: `Payment failed ${payload.error.message}` });
      this.setState({ processing: false });
    } else {
      this.setState({ error: null });
      this.setState({ processing: false });
      this.setState({ succeeded: true });
      this.createOrder();
      this.props.clearCart();
    }
  };

  createOrder = async () => {
    console.log(this.state.order);
    try {
      const response = await axios.post("/orders", this.state.order, {
        headers: {
          Authorization: `Bearer ${this.props.auth.user.token}`,
        },
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    return (
      <div className="container">
        <form id="payment-form" onSubmit={this.handleSubmit} className="">
          <CardElement
            id="card-element"
            /* options={cardStyle} */
            onChange={this.handleChange}
          />
          <button
            disabled={
              this.state.processing ||
              this.state.disabled ||
              this.state.succeeded
            }
            id="submit"
          >
            <span id="button-text">
              {this.state.processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Complete Purchase"
              )}
            </span>
          </button>

          {/* Show any error that happens when processing the payment */}
          {this.state.error && (
            <Alert message={this.state.error} className="danger" />
          )}

          {/* Show a success message upon completion */}
          {this.state.succeeded && (
            <Alert message="Payment Successful!" className="success" />
          )}
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { cart: state.cart, auth: state.auth };
};
export default connect(mapStateToProps, { clearCart })(CheckoutModal);
