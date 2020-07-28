import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import swal from "sweetalert";

import { addToCart } from "../actions/index";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

class ProductPage extends Component {
  state = { product: null, id: null, quantity: 1 };

  handleAddCart = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const product = {
      name: this.state.product.name,
      price: this.state.product.price / 100,
      imageURL: this.state.product.images[0].imageURL,
      id: this.state.product._id,
      description: this.state.product.description,
      quantity: this.state.quantity,
    };

    if (user) {
      if (user.user._id != this.state.product.user) {
        this.props.addToCart(product);
        swal("Success", "Product added to your cart!", "success");
      } else {
        swal("", "You can not buy your own product", "warning");
      }
    } else {
      this.props.addToCart(product);
      this.props.toast();
    }
  };

  componentDidMount = async () => {
    try {
      const id = this.props.match.params.id;
      const response = await axios.get(`/products/product/${id}`);

      this.setState({ product: response.data });
    } catch (error) {
      console.log(error);
    }
  };

  renderLoading = () => {
    return <LoadingSpinner />;
  };

  renderCarousel = () => {
    return (
      <div className="ui fluid image">
        <img
          src={`https://vast-forest-19749.herokuapp.com/${this.state.product.images[0].imageURL}`}
          alt=""
        />
      </div>
    );
  };

  renderRightTab = () => {
    return (
      <>
        <div className=" mt-5 mb-5">
          <h1>{this.state.product.name}</h1>
        </div>
        <div className="ui divider mt-5 mb-5"></div>
        <div className="mt-5 mb-5">
          <p>{this.state.product.description}</p>
        </div>
        <div className="ui divider mt-5 mb-5"></div>

        <div className="mt-5 mb-5">
          <h3>MXN {(this.state.product.price / 100).toFixed(2)}</h3>
        </div>

        <div className="mt-5 mb-5">
          <div class="ui action input">
            <select
              class="ui compact selection dropdown"
              name="quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
            >
              <option selected value="1">
                1
              </option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <div
              class="ui basic green button"
              disabled={!this.state.product.available}
              onClick={this.handleAddCart}
            >
              <i className="cart plus icon"></i>
              Add
            </div>
          </div>
        </div>
      </>
    );
  };

  renderDescription = () => {
    /* const contentState = convertFromRaw(
      JSON.parse(this.state.product.longDescription)
    );
    return <div className="ui segment">{contentState}</div>; */
  };

  renderProduct = () => {
    return (
      <>
        <div className="ui two column stackable center middle aligned grid mt-5">
          <div className="row">
            <div className="column">{this.renderCarousel()}</div>
            <div className="center aligned column">{this.renderRightTab()}</div>
          </div>

          <hr />
        </div>
        <div className="ui center aligned grid mt-5">
          <div className="row">
            <div className="sixteen wide column">
              {this.renderDescription()}
            </div>
          </div>
        </div>{" "}
      </>
    );
  };

  render() {
    return (
      <div className="ui container mt-5">
        {this.state.product == null && this.renderLoading()}
        {this.state.product != null && this.renderProduct()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { products: state.products };
};

export default connect(mapStateToProps, { addToCart })(ProductPage);
