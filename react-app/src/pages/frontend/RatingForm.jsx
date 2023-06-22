import React, { useState } from 'react';
import './ratingForm.css'
import { FaStar } from 'react-icons/fa';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import useAuthContext from '../../context/AuthContext';

const colors = {
    // orange: "#FFBA5A",
    color: 'rgb(255, 215, 0)',
    grey: "#a9a9a9"

};

const RatingForm = (props) => {

    const { currentUser } = useAuthContext();
    const idProduct = props.idProduct;
    const [currentValue, setCurrentValue] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverValue, setHoverValue] = useState(undefined);
    const stars = Array(5).fill(0)
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState(null);

    const handleClick = value => {
        setCurrentValue(value)
    }

    const handleMouseOver = newHoverValue => {
        setHoverValue(newHoverValue)
    };

    const handleMouseLeave = () => {
        setHoverValue(undefined)
    }

    const handleSubmit = () => {
        const newErrors = {};
        if (currentValue === 0) {
          newErrors.currentValue = "Bạn đánh giá sản phẩm này bao nhiêu sao";
        }
        if (!comment) {
          newErrors.comment = "Vui lòng nhập đánh giá của bạn";
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
      
        // Chèn dữ liệu
        const formData = new FormData();
        formData.append('productId', idProduct);
        formData.append('rating', currentValue);
        formData.append('comment', comment);
      
        setIsLoading(true);
        axios
          .post(`/api/review/v1/review_create`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            // Xử lý thành công, nhận thông báo từ phản hồi và hiển thị trong toast
            setIsLoading(false);
            toast.success(response.data.message);
            setCurrentValue(0);
            setComment('');
            // Thực hiện hành động tiếp theo sau khi đánh giá đã được tạo thành công
          })
          .catch((error) => {
            // Xử lý lỗi, nhận thông báo từ phản hồi hoặc xử lý lỗi khác
            setIsLoading(false);
            // Xử lý lỗi theo yêu cầu của bạn
            if (error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
            }
          });
      };

    return (
        <>
            <div style={styles.container}>
                <h2> Đánh giá của bạn </h2>
                <div style={styles.stars}>
                    {stars.map((_, index) => {
                        return (
                            <FaStar
                                key={index}
                                size={24}
                                onClick={() => handleClick(index + 1)}
                                onMouseOver={() => handleMouseOver(index + 1)}
                                onMouseLeave={handleMouseLeave}
                                color={(hoverValue || currentValue) > index ? colors.color : colors.grey}
                                style={{
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                            />
                        )
                    })}
                </div>
                {
                    errors.currentValue && (
                        <div className="alert fs-6 alert-danger" role="alert">
                            {errors.currentValue}
                        </div>
                    )
                }
                <label style={{color: '#00DFA2'}} htmlFor="">Đừng ngại cho mình 5 sao nhé! {currentUser?.name}</label>
                <textarea
                    placeholder="Đánh giá của bạn là gì?"
                    style={styles.textarea}
                    value={comment} onChange={(e) => setComment(e.target.value)}
                />
                {
                    errors.comment && (
                        <div className="alert fs-6 alert-danger" role="alert">
                            {errors.comment}
                        </div>
                    )
                }
                <button style={styles.button} onClick={handleSubmit}>
                    Đánh giá
                </button>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            </div>
        </>
    );

};
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    stars: {
        display: "flex",
        flexDirection: "row",
    },
    textarea: {
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        padding: 10,
        margin: "5px 0",
        minHeight: 100,
        width: 300
    },
    button: {
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        width: 300,
        padding: 10,
    }

};
export default RatingForm;
