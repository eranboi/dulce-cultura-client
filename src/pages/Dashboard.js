import React, { Component } from "react";
import { connect } from "react-redux";

import _ from "lodash";
import swal from "sweetalert";

import axios from "../api/axios";
import PendingSupplierCard from "../components/PendingSupplierCard";
import ProductsTab from "../components/dashboard/ProductsTab";
import Alert from "../components/Alert";
import DashboardMenu from "../components/dashboard/DashboardMenu";
import LoadingSpinner from "../components/LoadingSpinner";
import NewProduct from "./NewProduct";
import OrderTable from "../components/dashboard/OrderTable";

class Dashboard extends Component {
  state = {
    isReady: false,
    active: "",
    userRole: null,
    suppliersProducts: [],
    suppliersOrders: [],
    usersOrders: [],
    pendingSuppliers: [],
    allProducts: [],
    tab: "main",
  };

  componentDidMount = async () => {
    console.log(this.state.isReady);
    setTimeout(async () => {
      if (this.props && this.props.auth.isSignedIn === false)
        return this.props.history.push("/");

      const { auth } = this.props;

      if (
        (auth.user.user.role === "supplier" &&
          auth.user.user.status !== "pending") ||
        auth.user.user.role === "admin"
      ) {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user.token;
        this.fetchTheOrders();
        this.fetchTheOrders_user();

        //Get all the products of a supplier
        try {
          const responseProducts = await axios.get(
            `/products/${this.props.auth.user.user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          this.setState({ suppliersProducts: [...responseProducts.data] });
          this.setState({
            suppliersOrders: _.reverse(this.state.suppliersOrders),
          });
          this.setState({ isReady: true });
        } catch (error) {
          console.log(error.message);
        }
      }

      if (auth.user.user.status === "pending") {
        this.setState({ isReady: true });
      }

      if (auth.user.user.role === "user") {
        //Get all of the orders of current user
        this.fetchTheOrders_user();
        this.setState({ isReady: true });
      }

      if (auth.user.user.role === "admin") {
        //Get pending requests
        this.setState({ isReady: true });
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user.token;

        // Get the pending supplier requests!
        try {
          const response = await axios.get("/users/pending", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          response.data.map((pendingUser) => {
            this.setState({
              pendingSuppliers: [...this.state.pendingSuppliers, pendingUser],
            });
          });
        } catch (err) {
          console.log(err);
        }

        //Get all the products for admin
        try {
          const response = await axios.get("/products", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.setState({ allProducts: [...response.data] });
          this.setState({
            allProducts: _.reverse(this.state.allProducts),
          });
          console.log(response.statusText);
          this.setState({ isReady: true });
        } catch (error) {
          console.log(error);
        }
      }
    }, 1 * 1000);
  };

  fetchTheOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    //Get orders of a supplier
    try {
      const responseOrders = await axios.get("/orders/supplier", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.setState({ suppliersOrders: [] });
      responseOrders.data.map((order) => {
        this.setState({
          suppliersOrders: [...this.state.suppliersOrders, order],
        });
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  fetchTheOrders_user = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    //Get orders of a supplier
    try {
      const responseOrders = await axios.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({
        usersOrders: [...responseOrders.data],
      });
      console.log(this.state.isReady);
    } catch (err) {
      console.log(err.message);
    }

    this.setState({ usersOrders: _.reverse(this.state.usersOrders) });
    console.log(this.state.usersOrders);
  };

  onTabClick = (name) => {
    this.setState({ tab: name });
  };

  onApproveSupplier = (id) => {
    this.setState({
      pendingSuppliers: this.state.pendingSuppliers.filter((supplier) => {
        return supplier.user._id !== id;
      }),
    });
  };

  onMarkAsShippedClick = async (e, order, productIDs) => {
    let token = JSON.parse(localStorage.getItem("user")).token;

    e.preventDefault();
    try {
      const response = await axios.post(
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

      this.fetchTheOrders();
      /* if (_.isEmpty(response.data)) return;

      const newArray = _.find(this.state.suppliersOrders, (order) => {
        return order.orderID === response.data.order._id;
      });
      console.log(newArray);

      newArray.currentProducts = response.data.order.products;

      console.log(response.data);

      this.setState({ isReady: false }); */
      swal("Success", "You set these items as shipped!", "success");
      this.setState({ isReady: true });
    } catch (err) {
      console.log(err);
      swal("Error", "There was an error, please try again later!", "error");
    }
  };

  renderOrdersForSupplier = () => {
    let productIDs = [];
    if (_.isEmpty(this.state.suppliersOrders))
      return (
        <div className="ui segment">
          <Alert message="No Orders Found! " className="danger" />
        </div>
      );
    /* return <OrderTable suppliersOrders={this.state.suppliersOrders} />; */
    return this.state.suppliersOrders.map((order) => {
      let shipped = false;

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
                shipped = false;
              } else {
                shipped = true;
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
                {!shipped && (
                  <button
                    className="ui small green basic button"
                    onClick={(event) => {
                      shipped = true;
                      this.onMarkAsShippedClick(event, order, productIDs);
                    }}
                  >
                    <i className="shipping fast icon"></i>Mark as Shipped
                  </button>
                )}
                {shipped && <Alert message="Shipped!" className="success" />}
              </th>
            </tr>
          </tfoot>
        </table>
      );
    });
  };

  renderProductsForSupplier = () => {
    return (
      <ProductsTab
        products={this.state.suppliersProducts}
        onTabClick={this.onTabClick}
      />
    );
  };

  renderSupplier = () => {
    if (this.props.auth.user.user.status === "pending") {
      swal(
        "Pending",
        "Your application to become a supplier is still pending. Please get back soon!",
        "info"
      ).then(() => {
        this.props.history.push("/");
      });
    } else if (this.props.auth.user.user.status === "active") {
      return (
        <div>
          {this.state.tab === "main" && this.renderOrdersForSupplier()}
          {this.state.tab === "products" && this.renderProductsForSupplier()}
          {this.state.tab === "newProduct" && <NewProduct />}
          {this.state.tab === "myOrders" && this.renderOrdersForUser()}
        </div>
      );
    } else if (this.props.auth.user.user.status === "active") {
      swal(
        "Rejected",
        "Your application to become a supplier is rejected.",
        "error"
      );
    }
  };

  renderRequestsForAdmin = () => {
    if (!_.isEmpty(this.state.pendingSuppliers)) {
      return (
        <div className="ui cards">
          {/* Card */}
          {this.state.pendingSuppliers.map((pendingUser) => {
            return (
              <PendingSupplierCard
                user={pendingUser.user}
                onApproveSupplier={this.onApproveSupplier}
              />
            );
          })}
        </div>
      );
    } else
      return (
        <div className="ui segment">
          <Alert message="No pending requests!" className="danger" />
        </div>
      );
  };

  renderAllProductsForAdmin = () => {
    return (
      <ProductsTab
        products={this.state.allProducts}
        onTabClick={this.onTabClick}
      />
    );
  };

  renderForAdmin = () => {
    return (
      <div>
        {this.state.tab === "myOrders" && this.renderOrdersForUser()}
        {this.state.tab === "products" && this.renderProductsForSupplier()}
        {this.state.tab === "supplierRequests" && this.renderRequestsForAdmin()}
        {this.state.tab === "newProduct" && <NewProduct />}
        {this.state.tab === "allProducts" && this.renderAllProductsForAdmin()}
        {this.state.tab === "main" && this.renderOrdersForSupplier()}
      </div>
    );
  };

  renderOrdersForUser = () => {
    if (_.isEmpty(this.state.usersOrders))
      return (
        <div className="ui segment">
          <Alert message="No Orders Found! " className="danger" />
        </div>
      );
    /* return <OrderTable suppliersOrders={this.state.suppliersOrders} />; */
    return this.state.usersOrders.map((order) => {
      let shipped = false;

      return (
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Shipped</th>
            </tr>
          </thead>

          <tbody>
            {order.products.map((product) => {
              if (!product.shipped) {
                shipped = false;
              } else {
                shipped = true;
              }

              return (
                <tr key={product._id}>
                  <td data-label="Product Name">{product.product.name}</td>
                  <td data-label="Quantity">{product.quantity}</td>
                  <td data-label="Price">MXN {product.product.price / 100}</td>
                  <td data-label="Buyer">
                    {product.shipped && <i class="check green icon"></i>}
                    {!product.shipped && <i class="close red icon"></i>}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2"></th>
              <th colSpan="1">Total Amount: MXN {order.totalAmount}</th>
              <th colSpan="1"></th>
            </tr>
          </tfoot>
        </table>
      );
    });
  };

  render() {
    if (this.state.isReady) {
      return (
        <div className="ui container mt-5">
          {this.props.auth.isSignedIn && (
            <DashboardMenu
              user={this.props.auth.user.user}
              onTabClick={this.onTabClick}
            />
          )}
          {this.props.auth.isSignedIn && (
            <div className="ui divided items">
              {this.props.auth.user.user.role === "supplier" &&
                this.renderSupplier()}
              {this.props.auth.user.user.role === "admin" &&
                this.renderForAdmin()}
              {this.props.auth.user.user.role === "user" &&
                this.renderOrdersForUser()}
            </div>
          )}
        </div>
      );
    } else {
      return <LoadingSpinner />;
    }
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(Dashboard);
