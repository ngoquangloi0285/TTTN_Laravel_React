import React, { useEffect } from 'react'
import './cartCheckOut.css'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from '../../state/cartSlice';
import { AiOutlineLeft } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import Meta from '../../components/frontend/Meta';
import Maps from '../../components/frontend/Maps';

const CartCheckOut = () => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    const { cartTotalQuantity } = useSelector((state) => state.cart);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };
    const handleDecreaseCart = (product) => {
        dispatch(decreaseCart(product));
    };
    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };
    const handleClearCart = () => {
        dispatch(clearCart());
    };

    function calculateDiscountedPrice(price, discountPercent) {
        const discountAmount = (price * discountPercent) / 100;
        const discountedPrice = price - discountAmount;
        return discountedPrice;
    }
    return (
        <>
            <Meta title="Checkout" />
      <Maps title="Checkout" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className='checkout_cart'>
                        <h2>Responsive Checkout Form</h2>
                        <p>Resize the browser window to see the effect. When the screen is less than 800px wide, make the two columns stack on top of each other instead of next to each other.</p>
                        <div className="row">
                            <div className="col-75">
                                <div className="container">
                                    <form action="/action_page.php">
                                        <div className="row">
                                            <div className="col-50">
                                                <h3>Billing Address</h3>
                                                <label htmlFor="fname"><i className="fa fa-user" /> Full Name</label>
                                                <input type="text" id="fname" name="firstname" placeholder="John M. Doe" />
                                                <label htmlFor="email"><i className="fa fa-envelope" /> Email</label>
                                                <input type="text" id="email" name="email" placeholder="john@example.com" />
                                                <label htmlFor="adr"><i className="fa fa-address-card-o" /> Address</label>
                                                <input type="text" id="adr" name="address" placeholder="542 W. 15th Street" />
                                                <label htmlFor="city"><i className="fa fa-institution" /> City</label>
                                                <input type="text" id="city" name="city" placeholder="New York" />
                                                <div className="row">
                                                    <div className="col-50">
                                                        <label htmlFor="state">State</label>
                                                        <input type="text" id="state" name="state" placeholder="NY" />
                                                    </div>
                                                    <div className="col-50">
                                                        <label htmlFor="zip">Zip</label>
                                                        <input type="text" id="zip" name="zip" placeholder={10001} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-50">
                                                <h3>Payment</h3>
                                                <label htmlFor="fname">Accepted Cards</label>
                                                <div className="icon-container">
                                                    <i className="fa fa-cc-visa" style={{ color: 'navy' }} />
                                                    <i className="fa fa-cc-amex" style={{ color: 'blue' }} />
                                                    <i className="fa fa-cc-mastercard" style={{ color: 'red' }} />
                                                    <i className="fa fa-cc-discover" style={{ color: 'orange' }} />
                                                </div>
                                                <label htmlFor="cname">Name on Card</label>
                                                <input type="text" id="cname" name="cardname" placeholder="John More Doe" />
                                                <label htmlFor="ccnum">Credit card number</label>
                                                <input type="text" id="ccnum" name="cardnumber" placeholder="1111-2222-3333-4444" />
                                                <label htmlFor="expmonth">Exp Month</label>
                                                <input type="text" id="expmonth" name="expmonth" placeholder="September" />
                                                <div className="row">
                                                    <div className="col-50">
                                                        <label htmlFor="expyear">Exp Year</label>
                                                        <input type="text" id="expyear" name="expyear" placeholder={2018} />
                                                    </div>
                                                    <div className="col-50">
                                                        <label htmlFor="cvv">CVV</label>
                                                        <input type="text" id="cvv" name="cvv" placeholder={352} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <label>
                                            <input type="checkbox" defaultChecked="checked" name="sameadr" /> Shipping address same as billing
                                        </label>
                                        <input type="submit" defaultValue="Continue to checkout" className="btn" />
                                    </form>
                                </div>
                            </div>
                            <div className="col-25">
                                <div className="container">
                                    <h4>Cart <span className="price" style={{ color: 'black' }}><i className="fa fa-shopping-cart" /> <b>{cartTotalQuantity}</b></span></h4>
                                    {cart.cartItems.length === 0 ? (
                                        <div className="cart-empty">
                                            <p>Your cart is currently empty</p>
                                            <div className="start-shopping">
                                                <Link to="store">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        fill="currentColor"
                                                        className="bi bi-arrow-left"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                                                        />
                                                    </svg>
                                                    <span>Start Shopping</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {cart.cartItems.map((cartItem) => (
                                                <div key={cartItem.id}>
                                                    <p className="item-cart p-3">
                                                        <Link className="text-danger" to={`../product-detail/${cartItem.slug}`}>
                                                            {cartItem.name_product}
                                                        </Link>
                                                        <span className="price">
                                                            Quantity: <b>{cartItem.cartQuantity}</b> ${calculateDiscountedPrice(cartItem.price, cartItem.discount) * cartItem.cartQuantity}
                                                        </span>
                                                    </p>
                                                    <hr />
                                                </div>
                                            ))}
                                            <p>
                                                Total <span className="price" style={{ color: 'black' }}><b>${cart.cartTotalAmount}</b></span>
                                            </p>
                                        </>
                                    )}


                                </div>
                                <Link to="../store" className='d-flex justify-content-center'>
                                    <button className='btn'>
                                        <span><BsArrowLeft /> Continue Shopping</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default CartCheckOut