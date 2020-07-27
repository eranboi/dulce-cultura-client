import React, { Component } from "react";
import swal from "sweetalert";
import Alert from "../Alert";
import axios from "../../api/axios";

class OrderTable extends Component {
  state = { shipped: false };
  render() {
    let productIDs = [];
    let token = JSON.parse(localStorage.getItem("user")).token;

    return this.props.suppliersOrders.map((order) => {
      return (
        <table className="ui red celled table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Shipping Addres</th>
              <th>Buyer</th>
            </tr>
          </thead>

          <tbody>
            {order.currentProducts.map((product) => {
              productIDs.push(product.product._id);
              if (!product.shipped) {
                this.setState({ shipped: false });
              } else {
                this.setState({ shipped: true });
              }

              return (
                <tr key={product._id}>
                  <td data-label="Product Name">{product.product.name}</td>
                  <td data-label="Quantity">{product.quantity}</td>
                  <td data-label="Shipping Addres">
                    {order.currentUser.address}
                  </td>
                  <td data-label="Buyer">{order.currentUser.name}</td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan="4">
                {!this.state.shipped && (
                  <button
                    className="ui small green basic button"
                    onClick={(e) => {
                      e.preventDefault();
                      try {
                        axios.post(
                          "/orders/setshipped",
                          {
                            orderID: order.orderID,
                            productIDs,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        this.setState({ shipped: true });
                        swal(
                          "Success",
                          "You set these items as shipped!",
                          "success"
                        );
                      } catch (err) {
                        console.log(err);
                        swal(
                          "Error",
                          "There was an error, please try again later!",
                          "error"
                        );
                      }
                    }}
                  >
                    <i className="shipping fast icon"></i>Mark as Shipped
                  </button>
                )}
                {this.state.shipped && (
                  <Alert message="Shipped!" className="success" />
                )}
              </th>
            </tr>
          </tfoot>
        </table>
      );
    });
  }
}

export default OrderTable;
