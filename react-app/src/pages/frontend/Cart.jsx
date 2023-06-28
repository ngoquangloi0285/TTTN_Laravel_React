import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from '../../state/cartSlice';
import Meta from '../../components/frontend/Meta';
import Maps from '../../components/frontend/Maps';
import useAuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigation = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

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
  const { currentUser } = useAuthContext();
  const handleCheckUser = () => {
    if (!currentUser) {
      toast.error('Bạn cần đăng nhập để đặt hàng!')
    }
    else {
      navigation('../cart/checkout');
    }
  }
  return (
    <>
      <Meta title="Giỏ hàng của bạn" />
      <Maps title="Giỏ hàng của bạn" />
      <div className="cart-container">
        <h2>Giỏ hàng của bạn</h2>
        {cart.cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="container-xxl">
              <div className="row">
                <div className='py-5'>
                  <h1 className='py-3 text-center'>Không có sảm phẩm nào trong giỏ hàng!</h1>
                </div>
              </div>
            </div>
            <div className="start-shopping">
              <Link to="../store">
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
                <span>Bắt đầu mua sắm</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="titles">
              <h3 className="product-title">Sản phẩm</h3>
              <h3 className="price">Giá</h3>
              <h3 className="quantity">Số lượng</h3>
              <h3 className="total">Tổng chi sản phẩm</h3>
            </div>
            <div className="cart-items">
              {cart.cartItems &&
                cart.cartItems.map((cartItem) => (
                  <div className="cart-item" key={cartItem.id}>
                    <div className="cart-product">
                      <Link title='review' to={`../product-detail/${cartItem.slug}`}>
                        <img className='img-fluid' src={`http://localhost:8000/storage/product/${cartItem.image}`} style={{ width: '150px' }} alt={cartItem.name_product} />
                      </Link>
                      <div className='ml-3'>
                        <p className='fs-5'>{cartItem.name_product}</p>
                        <p className='m-0'>Màu sản phẩm: <strong>{cartItem.color}</strong></p>
                        <button className='cart-remove' onClick={() => handleRemoveFromCart(cartItem)}>
                          Xóa sản phẩm này
                        </button>
                      </div>
                    </div>
                    <div className="cart-product-price">
                      {calculateDiscountedPrice(cartItem.price, cartItem.discount).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </div>
                    <div className="cart-product-quantity">
                      <button onClick={() => handleDecreaseCart(cartItem)}>
                        -
                      </button>
                      <div className="count">{cartItem.cartQuantity}</div>
                      <button onClick={() => handleAddToCart(cartItem)}>+</button>
                    </div>
                    <div className="cart-product-total-price">
                      {(calculateDiscountedPrice(cartItem.price, cartItem.discount) * cartItem.cartQuantity).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </div>
                  </div>
                ))}
            </div>
            <div className="cart-summary">
              <button className="clear-btn cart-remove" onClick={() => handleClearCart()}>
                Xóa giỏ hàng
              </button>
              <div className="cart-checkout">
                <div className="subtotal">
                  <span>Tổng phụ</span>
                  <span className="amount">{cart.cartTotalAmount.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  })}</span>
                </div>
                <p>Thuế và vận chuyển được tính khi thanh toán</p>
                <button onClick={handleCheckUser} className='cart-checkout'>
                  Thủ tục thanh toán
                </button>
                <div className="continue-shopping">
                  <Link to="../store">
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
                    <span>Tiếp mua sắm</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
