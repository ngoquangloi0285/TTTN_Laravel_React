import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/actions";

const initialState = {
  cartItems: []
};

function cartReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      };
    case REMOVE_FROM_CART:
      const index = state.cartItems.indexOf(action.payload);
      return {
        ...state,
        cartItems: [
          ...state.cartItems.slice(0, index),
          ...state.cartItems.slice(index + 1)
        ]
      };
    default:
      return state;
  }
}

export default cartReducer;
