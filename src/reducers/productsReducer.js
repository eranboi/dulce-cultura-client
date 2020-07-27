const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS":
      return [...state, ...action.payload];
    case "FETCH_PRODUCTS_ERROR":
      return { error: action.payload };
    default:
      return state;
  }
};
