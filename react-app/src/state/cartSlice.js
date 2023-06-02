import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
};
const countUniqueItems = (cartItems) => {
    const uniqueIds = new Set();
    cartItems.forEach((item) => {
        uniqueIds.add(item.id);
    });
    return uniqueIds.size;
};
function calculateDiscountedPrice(price, discountPercent) {
    const discountAmount = (price * discountPercent) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice;
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const existingIndex = state.cartItems.findIndex(
                (item) => item.id === action.payload.id
            );

            if (existingIndex >= 0) {
                state.cartItems[existingIndex] = {
                    ...state.cartItems[existingIndex],
                    cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
                };
                toast.info("Số lượng sản phẩm tăng", {
                    position: "top-right",
                });
            } else {
                let tempProductItem = { ...action.payload.product, cartQuantity: 1, color: action.payload.selectedColor };
                state.cartItems.push(tempProductItem);
                toast.success("Đã thêm sản phẩm vào giỏ hàng", {
                    position: "top-right",
                });
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        
        decreaseCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (item) => item.id === action.payload.id
            );

            if (state.cartItems[itemIndex].cartQuantity > 1) {
                state.cartItems[itemIndex].cartQuantity -= 1;

                toast.info("Số lượng sản phẩm giảm", {
                    position: "top-right",
                });
            } else if (state.cartItems[itemIndex].cartQuantity === 1) {
                const nextCartItems = state.cartItems.filter(
                    (item) => item.id !== action.payload.id
                );

                state.cartItems = nextCartItems;

                toast.error("Đã xóa sản phẩm khỏi giỏ hàng", {
                    position: "top-right",
                });
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            state.cartItems.map((cartItem) => {
                if (cartItem.id === action.payload.id) {
                    const nextCartItems = state.cartItems.filter(
                        (item) => item.id !== cartItem.id
                    );

                    state.cartItems = nextCartItems;

                    toast.error("Đã xóa sản phẩm khỏi giỏ hàng", {
                        position: "top-right",
                    });
                }
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                return state;
            });
        },

        getTotals(state, action) {
            let { total, quantity } = state.cartItems.reduce(
                (cartTotal, cartItem) => {
                    const { price, discount, cartQuantity } = cartItem;
                    const priceSale = calculateDiscountedPrice(price, discount);
                    const itemTotal = priceSale * cartQuantity;
                    cartTotal.total += itemTotal;
                    cartTotal.quantity += cartQuantity;

                    return cartTotal;
                },
                {
                    total: 0,
                    quantity: 0,
                }
            );

            total = parseFloat(total.toFixed(2));
            state.cartTotalQuantity = quantity;
            state.cartTotalAmount = total;
            state.uniqueItemCount = countUniqueItems(state.cartItems); // Thêm dòng này
        },

        clearCart(state, action) {
            state.cartItems = [];
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            toast.error("Đã xóa giỏ hàng", { position: "top-right" });
        },
    },

});

export const { addToCart, decreaseCart, removeFromCart, getTotals, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;   
