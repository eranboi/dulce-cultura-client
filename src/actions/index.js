import axios from "../api/axios";
import _ from "lodash";

/* PRODUCTS */

const _fetchProducts = _.memoize(async (dispatch) => {
  try {
    const response = await axios.get("/products");
    dispatch({
      type: "FETCH_PRODUCTS",
      payload: response.data,
    });
  } catch (error) {
    console.log(error.response);

    if (error.response) {
      dispatch({
        type: "FETCH_PRODUCTS_ERROR",
        payload: error.response.data,
      });
    }
  }
});
export const fetchProducts = () => (dispatch) => {
  _fetchProducts(dispatch);
};

/* USERS */

export const signInUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post("/users/login", { email, password });

    localStorage.setItem("user", JSON.stringify(response.data));

    dispatch({
      type: "SIGN_IN",
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: "SIGN_IN_ERROR",
      payload: err.response.data.error,
    });
  }
};

export const signUp = (info) => async (dispatch) => {
  try {
    const response = await axios.post("/users", info);

    localStorage.setItem("user", JSON.stringify(response.data));

    dispatch({
      type: "SIGN_UP",
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: "SIGN_UP_ERROR",
      payload: err.response.data.error,
    });
  }
};

export const autoSignIn = () => async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return;
    }
    dispatch({
      type: "AUTO_SIGN_IN",
      payload: user,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const signOut = () => (dispatch) => {
  localStorage.removeItem("user");

  dispatch({
    type: "SIGN_OUT",
  });
};
/* CART */
export const addToCart = (product) => {
  return {
    type: "ADD_TO_CART",
    payload: product,
  };
};

export const removeFromCart = (product) => {
  return {
    type: "REMOVE_FROM_CART",
    payload: product,
  };
};

export const clearCart = () => {
  return {
    type: "CLEAR_CART",
  };
};
