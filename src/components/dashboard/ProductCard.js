import { Link } from "react-router-dom";
import React, { Component } from "react";
import _ from "lodash";
import swal from "sweetalert";

class EditProductCard extends Component {
  state = {};

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.product.available !== this.props.product.available) {
      console.log(prevProps.product.available);
      console.log("^^ Prev");
      console.log(this.props.product.available);
      console.log("^^ Now");
      this.renderAvailability();
    }
  }
  renderCard = () => {};

  renderButtons = () => {
    if (this.props.product.available) {
      return (
        <div className="ui two buttons">
          <Link
            className="ui button"
            to={`/edit/product/${this.props.product._id}`}
          >
            <i className="edit icon"></i>Edit
          </Link>
          {/* Availability button */}
          <button
            className="ui button"
            onClick={() => {
              swal("Do you want to make this product unavailable?", {
                buttons: ["Dismiss", "Make it unavailable"],
              }).then(async (value) => {
                if (value === true) {
                  const isSuccess = await this.props.deleteProduct(
                    this.props.product._id
                  );
                  if (isSuccess)
                    swal("", "Product is now unavailable", "success");
                  else swal("", "your request couldn't be completed", "error");
                }
              });
            }}
          >
            Unavailable
          </button>
        </div>
      );
    } else if (!this.props.product.available) {
      return (
        <div className="ui two buttons">
          <Link
            className="ui button"
            to={`/edit/product/${this.props.product._id}`}
          >
            <i className="edit icon"></i>Edit
          </Link>
          {/* Availability button */}
          <button
            className="ui button"
            onClick={() => {
              swal(
                "Are you sure?",
                "Do you want to make this product available?",
                "warning",
                {
                  buttons: ["Dismiss", "Make it available"],
                }
              ).then(async (value) => {
                if (value === true) {
                  const isSuccess = await this.props.availableProduct(
                    this.props.product._id
                  );
                  if (isSuccess)
                    swal("", "Product is now available", "success");
                  else swal("", "your request couldn't be completed", "error");
                }
              });
            }}
          >
            Available
          </button>
        </div>
      );
    }
  };

  renderAvailability = () => {
    if (this.props.product.available) {
      return <a className="ui teal ribbon label">Available</a>;
    } else if (!this.props.product.available) {
      return <a className="ui red ribbon label">Not Available</a>;
    }
  };

  render() {
    const product = this.props.product;
    return (
      <div className="ui card">
        <div className="image">
          <img
            src={`https://dulcecultura.s3.amazonaws.com/${product.images[0].imageURL}`}
          />
        </div>
        <div className="content">
          {this.renderAvailability()}
          <div className="header mt-3">{product.name}</div>
          <div className="meta">
            <div>MXN {product.price / 100}</div>
          </div>
          <div className="extra content">{this.renderButtons()}</div>
        </div>
      </div>
    );
  }
}

export default EditProductCard;
