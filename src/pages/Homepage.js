import React, { Component } from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import Card from "../components/Card";
import "./FeaturedProduct.css";
import { fetchProducts, signInUser, addToCart } from "../actions/index";
import LoadingSpinner from "../components/LoadingSpinner";

class Homepage extends Component {
  state = { ProductMode: "Candy" };

  constructor(props) {
    super(props);
    props.fetchProducts();
  }
  componentDidMount() {
    this.props.fetchProducts();
  }

  AddToCart = (product) => {
    console.log(product);

    this.props.addToCart(product);
  };

  showToast = () => {
    swal("Success", "Product added to your cart!", "success");
  };

  toastOwnItem = () => {
    swal("", "You can not buy your own product", "warning");
  };

  renderProducts = () => {
    return this.props.products.map((product) => {
      if (product.type === this.state.ProductMode) {
        return (
          <Card
            key={product._id}
            user={product.user}
            AddToCart={this.AddToCart}
            id={product._id}
            name={product.name}
            description={product.description}
            price={product.price / 100}
            available={product.available}
            images={product.images}
            toast={this.showToast}
            toastOwnItem={this.toastOwnItem}
          />
        );
      }
    });
  };

  renderFeatured = () => {
    return (
      <div className="featured-main">
        <img
          className="ui fluid image"
          src={require("../img/featured-1.png")}
          alt=""
        />
        <div className="featured-overlay">
          <div className="featured-name">
            <h4>Product Name</h4>
          </div>
          <div className="featured-price">
            <h4>Product Price</h4>
          </div>
        </div>
      </div>
    );
  };

  renderMenu = () => {
    return (
      <div className="ui container mt-5">
        <div class="ui grey inverted three item menu">
          <a
            class="item"
            onClick={() => {
              this.setState({ ProductMode: "Candy" });
            }}
          >
            Candy
          </a>
          <a
            class="item"
            onClick={() => {
              this.setState({ ProductMode: "Art" });
            }}
          >
            Art
          </a>
          <a
            class="item"
            onClick={() => {
              this.setState({ ProductMode: "Clothing" });
            }}
          >
            Clothing
          </a>
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        {!this.props.products && <LoadingSpinner />}
        <div
          className="ui fluid container mt-5"
          style={{
            marginLeft: "3em!important",
            marginRight: "3em!important",
          }}
        >
          {this.renderFeatured()}
        </div>

        {this.renderMenu()}

        <div className="ui fluid container mt-5 mb-5 text-center">
          <h2>{this.state.ProductMode}</h2>
        </div>

        <div
          className="ui fluid container mt-5"
          style={{
            marginLeft: "3em",
            marginRight: "3em",
          }}
        >
          <div
            className="ui three stackable cards"
            style={{
              marginLeft: "3em",
              marginRight: "3em",
            }}
          >
            {this.renderProducts()}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { products: state.products };
};
export default connect(mapStateToProps, {
  fetchProducts,
  signInUser,
  addToCart,
})(Homepage);
