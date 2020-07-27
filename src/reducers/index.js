import { combineReducers } from "redux";
import authReducer from "./authReducer";
import productsReducer from "./productsReducer";
import cartReducer from "./cartReducer";

export default combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
});
