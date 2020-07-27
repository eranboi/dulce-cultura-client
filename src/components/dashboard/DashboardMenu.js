import React, { Component } from "react";

class DashboardMenu extends Component {
  state = { user: null };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user) {
      this.setState({ user: this.props.user });
      console.log(this.props.user);
    }
    if (!this.props.user) return this.props.history.push("/");
  }

  renderMenu_supplier = () => {
    return (
      <div className="ui menu">
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("main");
          }}
        >
          Orders
        </a>
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("products");
          }}
        >
          Products
        </a>
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("newProduct");
          }}
        >
          New Product
        </a>
      </div>
    );
  };

  renderMenu_user = () => {
    return (
      <div className="ui menu">
        <a className="item">My Orders</a>
      </div>
    );
  };

  renderMenu_admin = () => {
    return (
      <div className="ui stackable menu">
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("supplierRequests");
          }}
        >
          Supplier Requests
        </a>
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("main");
          }}
        >
          Orders
        </a>
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("products");
          }}
        >
          My Products
        </a>
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("allProducts");
          }}
        >
          All Products
        </a>
        <a
          className="item"
          onClick={() => {
            this.props.onTabClick("newProduct");
          }}
        >
          New Product
        </a>
      </div>
    );
  };

  renderMenu = () => {
    if (this.props.user.role === "user") return this.renderMenu_user();
    else if (this.props.user.role === "supplier")
      return this.renderMenu_supplier();
    else if (this.props.user.role === "admin") return this.renderMenu_admin();
  };

  render() {
    return (
      <div>
        {this.props.user && this.renderMenu()}
        {!this.props.user && <div>No user</div>}
      </div>
    );
  }
}

export default DashboardMenu;
