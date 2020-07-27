import React from "react";
import ReactDOM from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import CheckoutModal from "../components/CheckoutModal";
import "./Checkout.css";
import Modal from "../components/Modal";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe("pk_test_QQHwCbBJb1afFxcMFwDTZ91L008yI2TaoT");
const CheckoutPage = (props) => {
  return ReactDOM.createPortal(
    <Modal onOutsideClick={props.onOutsideClick}>
      <Elements stripe={promise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <CheckoutModal
              elements={elements}
              stripe={stripe}
              onOutsideClick={props.onOutsideClick}
              totalAmount={props.totalAmount}
            />
          )}
        </ElementsConsumer>
      </Elements>
    </Modal>,
    document.getElementById("modal")
  );
};
export default CheckoutPage;
