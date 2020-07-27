import React, { Component } from "react";

import _ from "lodash";
import ProductCard from "./ProductCard";
import Alert from "../Alert";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

class ProductsTab extends Component {
  state = { products: [], error: null, isReady: false };
  componentDidMount() {
    if (_.isEmpty(this.props.products)) {
      return this.setState({ error: "No Product Found! " });
    }
    this.setState({ products: [...this.props.products] });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.products !== this.state.products &&
      !_.isEmpty(this.state.products)
    ) {
      this.setState({ isReady: true });
    }
  }

  renderNoProducts = () => {
    return (
      <div className="ui segment">
        <Alert message={this.state.error} className="danger" />
        <a
          style={{ color: "#6B83C4", cursor: "pointer" }}
          onClick={() => {
            this.props.onTabClick("newProduct");
          }}
        >
          Create one?
        </a>
      </div>
    );
  };

  onClick = async (id, data) => {
    try {
      const response = await axios.patch(`/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      });
    } catch (error) {
      this.setState({ error: error });
    }
    {
    }
  };

  deleteProduct = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;
      const response = await axios.get(`/products/unavailable/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let tempArray = this.state.products;

      // Make it unavailable
      const obj = _.find(tempArray, { _id: id });

      obj.available = false;

      console.log(tempArray);

      this.setState({
        products: tempArray,
      });
      console.log(this.state.products);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  availableProduct = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;
      const response = await axios.get(`/products/available/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let tempArray = this.state.products;

      // Make it unavailable
      const obj = _.find(tempArray, { _id: id });

      obj.available = true;

      console.log(tempArray);

      this.setState({
        products: tempArray,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  renderProducts = () => {
    return this.state.products.map((product) => {
      return (
        <ProductCard
          key={product._id}
          product={product}
          onClick={this.onClick}
          deleteProduct={this.deleteProduct}
          availableProduct={this.availableProduct}
        />
      );
    });
  };

  render() {
    return (
      <>
        {this.state.error && this.renderNoProducts()}

        {!_.isEmpty(this.state.products) && (
          <div className="ui segment">
            <div className="ui stackable three cards">
              {this.renderProducts()}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default ProductsTab;
