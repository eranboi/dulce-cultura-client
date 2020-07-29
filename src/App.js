import React, { Component } from "react";
import {
  Switch,
  Route,
  HashRouter,
  BrowserRouter,
  Router,
} from "react-router-dom";

import history from "./history";
import NavigationBar from "./components/Navbar";

import HomePage from "./pages/Homepage";
import Signin from "./pages/Login";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import { connect } from "react-redux";
import { autoSignIn, fetchProducts } from "./actions";
import Dashboard from "./pages/Dashboard";
import ProductPage from "./pages/ProductPage";
import EditProduct from "./pages/EditProduct";

class App extends Component {
  componentDidMount() {
    this.props.autoSignIn();
    this.props.fetchProducts();
  }
  render() {
    return (
      <HashRouter history={history}>
        <NavigationBar />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/cart" exact component={Cart} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/checkout" exact component={Checkout} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/products/:id" exact component={ProductPage} />
          <Route path="/edit/product/:id" exact component={EditProduct} />
        </Switch>
      </HashRouter>
    );
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, { autoSignIn, fetchProducts })(App);
