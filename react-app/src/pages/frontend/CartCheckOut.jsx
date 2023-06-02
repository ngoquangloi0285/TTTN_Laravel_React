import React, { useEffect, useState } from 'react'
import './cartCheckOut.css'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from '../../state/cartSlice';
import { AiOutlineLeft } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import Meta from '../../components/frontend/Meta';
import Maps from '../../components/frontend/Maps';
import useAuthContext from '../../context/AuthContext';

const CartCheckOut = () => {
    const { currentUser } = useAuthContext();

    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [fullname, setFullname] = useState(currentUser?.name ? currentUser.name : null);
    const [email, setEmail] = useState(currentUser?.email ? currentUser.email : null);
    const [address, setAddress] = useState(currentUser?.address ? currentUser.address : null);
    const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone : null);
    const [city, setCity] = useState(null);
    const [code, setCode] = useState(null);
    const [checked, setChecked] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleChecked = (e) => {
        setChecked(e.target.checked);
        console.log(e.target.checked)
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!fullname) {
            newErrors.fullname = "Vui lòng nhập họ tên người đặt hàng!";
        }
        if (!email) {
            newErrors.email = "Vui lòng nhập địa chỉ email của bạn.";
        }
        if (!address) {
            newErrors.address = "Vui lòng nhập địa chỉ nhận hàng của bạn";
        }
        if (!city) {
            newErrors.city = "Vui lòng nhập thành phố bạn đang sinh sống hoặc ở tỉnh của bạn";
        }
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại đặt hàng.";
        }
        else if (isNaN(phone)) {
            newErrors.phone = "Số điện thoại phải là số.";
        }
        else if (phone.length !== 10 && phone.length !== 11) {
            newErrors.phone = "Số điện thoại phải có 10 hoặc 11 chữ số.";
        }
        if (!code) {
            newErrors.code = "Vui lòng nhập mã bưu điện ở nơi bạn đang sinh sống để chúng tôi gửi chính xác và nhanh chóng.";
        }
        else if (isNaN(code)) {
            newErrors.code = "Mã bưu điện phải là số.";
        }
        else if (code.length !== 5) {
            newErrors.code = "Mã bưu điện phải có 5 số.";
        }
        if (checked === false) {
            newErrors.checked = "Vui lòng xác nhận trước khi hoàn tất đặt hàng!";
        }
        if (!paymentMethod) {
            newErrors.paymentMethod = "Vui lòng chọn hình thanh toán!";
        }
        // Kiểm tra các giá trị khác và thêm thông báo lỗi tương ứng vào object `newErrors`
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }
        if (checked === true) {
            alert(checked);
        }
    }

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    const { cartTotalQuantity } = useSelector((state) => state.cart);

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
                        <h2>Thủ tục thanh toán đơn hàng của bạn!</h2>
                        <div className="row">
                            <div className="col-75">
                                <div className="container">
                                    <form onSubmit={handleCheckout}>
                                        <div className="row">
                                            <div className="col-50">
                                                <h3>Địa chỉ thanh toán</h3>
                                                <label htmlFor="fname"><i className="fa fa-user" /> Họ tên đầy đủ<span className='fs-3 text-danger'>*</span></label>
                                                <input value={fullname} onChange={(e) => setFullname(e.target.value)} type="text" id="fname" name="firstname" placeholder="John M. Doe" />
                                                {errors.fullname && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errors.fullname}
                                                    </div>
                                                )}
                                                <label htmlFor="email"><i className="fa fa-envelope" /> Email<span className='fs-3 text-danger'>*</span></label>
                                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="email" name="email" placeholder="john@example.com" />
                                                {errors.email && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errors.email}
                                                    </div>
                                                )}
                                                <label htmlFor="phone"><i className="fa fa-phone" /> Số điện thoại<span className='fs-3 text-danger'>*</span></label>
                                                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" id="phone" name="phone" placeholder="0352412318" />
                                                {errors.phone && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errors.phone}
                                                    </div>
                                                )}
                                                <label htmlFor="adr"><i className="fa fa-address-card-o" /> Địa chỉ<span className='fs-3 text-danger'>*</span></label>
                                                <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" id="adr" name="address" placeholder="103, đường Tăng Nhơn Phú, Phường Phước Long B" />
                                                {errors.address && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errors.address}
                                                    </div>
                                                )}
                                                <label htmlFor="city"><i className="fa fa-institution" /> Thành phố<span className='fs-3 text-danger'>*</span></label>
                                                <input value={city} onChange={(e) => setCity(e.target.value)} type="text" id="city" name="city" placeholder="Thành Phố Thủ Đức" />
                                                {errors.city && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errors.city}
                                                    </div>
                                                )}
                                                <div className="row">
                                                    <div className="col-50">
                                                        <label htmlFor="zip">Mã bưu điện<span className='fs-3 text-danger'>*</span></label>
                                                        <input value={code} onChange={(e) => setCode(e.target.value)} type="text" id="zip" name="zip" placeholder={10001} />
                                                        {errors.code && (
                                                            <div className="alert alert-danger" role="alert">
                                                                {errors.code}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-50">
                                                <div>
                                                    <h3>Payment</h3>
                                                    <label htmlFor="fname">Chọn loại hình thanh toán:</label>
                                                    <label htmlFor="cash">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            id="cash"
                                                            value="cash"
                                                            checked={paymentMethod === 'cash'}
                                                            onChange={handlePaymentMethodChange}
                                                        />
                                                        Thanh toán khi nhận hàng
                                                    </label>
                                                    <label htmlFor="credit">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            id="credit"
                                                            value="credit"
                                                            checked={paymentMethod === 'credit'}
                                                            onChange={handlePaymentMethodChange}
                                                        />
                                                        Thanh toán bằng thẻ tín dụng
                                                    </label>
                                                    {errors.paymentMethod && (
                                                        <div className="alert alert-danger" role="alert">
                                                            {errors.paymentMethod}
                                                        </div>
                                                    )}
                                                    {paymentMethod === 'credit' && (
                                                        <>
                                                            <p className='m-0 text-danger'> <span className='fs-4'>*</span> Chúng tôi đang cố gắng hoàn thành chức năng, <br /> Xin lỗi vì sự bất tiện này!</p>
                                                            <label htmlFor="fname" className='mt-3'><strong>Thẻ được chấp nhận</strong></label>
                                                            <div className="icon-container">
                                                                <img width='25%' src="https://www.freepnglogos.com/uploads/visa-and-mastercard-logo-26.png" alt="" />
                                                            </div>
                                                            <label htmlFor="cname">Tên trên thẻ</label>
                                                            <input disabled type="text" id="cname" name="cardname" placeholder="NGO QUANG LOI" />
                                                            <label htmlFor="ccnum">Số thẻ tín dụng</label>
                                                            <input disabled type="text" id="ccnum" name="cardnumber" placeholder="1111-2222-3333-4444" />
                                                            <label htmlFor="expmonth">Tháng hết hạng</label>
                                                            <input disabled type="text" id="expmonth" name="expmonth" placeholder="9/*" />
                                                            <div className="row">
                                                                <div className="col-50">
                                                                    <label htmlFor="expyear">Năm hết hạng</label>
                                                                    <input disabled type="text" id="expyear" name="expyear" placeholder='*/2025' />
                                                                </div>
                                                                <div className="col-50">
                                                                    <label htmlFor="cvv">CVV</label>
                                                                    <input disabled type="text" id="cvv" name="cvv" placeholder='325' />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <label>
                                                    <input onChange={handleChecked} type="checkbox" /> Địa chỉ giao hàng giống như trên
                                                </label>
                                                {errors.checked && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {errors.checked}
                                                    </div>
                                                )}
                                                <button type="submit" className='btn'>Đặt hàng</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                            <div className="col-25">
                                <div className="container">
                                    <h4>Your cart <span className="price" style={{ color: 'black' }}><i className="fa fa-shopping-cart" /> <b>{cartTotalQuantity}</b></span></h4>
                                    {cart.cartItems.length === 0 ? (
                                        <div className="cart-empty">
                                            <p>Giỏ hàng của bạn không có sản phẩm</p>
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
                                                    <span>Tiếp tục mua hàng</span>
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
                                                            Số lượng: <b>{cartItem.cartQuantity},</b> {(calculateDiscountedPrice(cartItem.price, cartItem.discount) * cartItem.cartQuantity).toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            })}

                                                        </span>
                                                    </p>
                                                    <hr />
                                                </div>
                                            ))}
                                            <p>
                                                Tổng chi phí <span className="price" style={{ color: 'black' }}><b>{cart.cartTotalAmount.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}</b></span>
                                            </p>
                                        </>
                                    )}
                                </div>
                                <Link to="../cart" className='d-flex justify-content-center'>
                                    <button className='btn'>
                                        <span><BsArrowLeft /> Trở về giỏ hàng</span>
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