const INITIAL_STATE = {
  isSignedIn: false,
  user: null,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "AUTO_SIGN_IN":
      return {
        ...state,
        isSignedIn: true,
        user: action.payload,
        error: null,
      };
    case "SIGN_IN":
      return {
        ...state,
        isSignedIn: true,
        user: action.payload,
        error: null,
      };
    case "SIGN_UP":
      return {
        ...state,
        isSignedIn: true,
        user: action.payload,
        error: null,
      };
    case "SIGN_OUT":
      return { ...state, isSignedIn: false, user: null, error: null };

    case "SIGN_IN_ERROR":
      return { ...state, error: action.payload };
    case "SIGN_UP_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
