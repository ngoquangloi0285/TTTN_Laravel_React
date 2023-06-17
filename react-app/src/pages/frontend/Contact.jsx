import React, { useState } from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta';
import { AiOutlineHome, AiOutlineMail, AiOutlineInfoCircle, AiOutlineClear } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import useAuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router';

const Contact = () => {
  const { currentUser } = useAuthContext();
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");


  const handleSubmit = async () => {
    const btn = document.getElementById('btn-submit');

    // định nghĩa lỗi
    const newErrors = {};

    if (!name) {
      newErrors.name = "Please enter your name.";
    }
    if (!email) {
      newErrors.email = "Please enter your email";
    }
    if (!phone) {
      newErrors.phone = "Please enter your phone";
    }
    if (isNaN(phone)) {
      newErrors.phone = "Phone number must be a number.";
    }
    else if (phone.length !== 10 && phone.length !== 11) {
      newErrors.phone = "Phone number must be 10 or 11 digits.";
    }
    if (!comment) {
      newErrors.comment = "Please leave your message.";
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
    
    // chèn dữ liệu
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('comment', comment);

    console.log(formData)
    try {
      btn.innerHTML = "Sending...";
      const response = await axios.post('/api/contact/v1/create-contact', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsLoading(false);
      btn.innerHTML = "Submit";
      if (response.status === 200) {
        setStatus(response.data.status)
        // toast.success(response.data.status);
        // Nếu thành công, hiển thị thông báo thành công
        Swal.fire('Your answer has been recorded!', response.data.message, 'success');
      }
      setName("");
      setEmail("");
      setPhone("");
      setComment("");
      setStatus("We will contact you as soon as possible!")
    } catch (error) {
      setIsLoading(false);
      // Nếu xảy ra lỗi, hiển thị thông báo lỗi
      if (error.response.status === 500) {
        Swal.fire('Error!', error.response.data.error, 'error');
      } else {
        Swal.fire('Error!', 'Failed to create new Category.', 'error');
      }
      btn.innerHTML = "Submit";
    }
  }
  const navigate = useNavigate();

  const checkLogin = (e) => {
    e.preventDefault();
    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'You are not logged in!',
        text: "Please login to send your message!",
        confirmButtonText: 'Back to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('../login')
        }
      });
    }
    if (currentUser) {
      handleSubmit();
    }
  }

  return (
    <>
      <Meta title={"Liên hệ với chúng tôi"} />
      <Maps title="Liên hệ với chúng tôi" />
      <div className="contact-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7176.493568571335!2d106.77288900000002!3d10.829584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2s!4v1678168811275!5m2!1svi!2s" width="600" height="450" className='border-0 w-100' allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="col-12 mt-5">
              <div className="content-wrapper d-flex justify-content-center shadow">
                {
                  status &&
                  <div className="alert alert-success" role="alert">
                    {status}
                  </div>
                }
                <div className="col-6">
                  <h3 className='contact-title mb-4'>Liên hệ</h3>
                  <div className='my-2'>
                    <input name='name' value={name} onChange={(e) => setName(e.target.value)} type="text" className='form-control' placeholder='Ngô Quang Lợi' />
                    {errors.name && (
                      <div className="alert alert-danger" role="alert">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div className='my-2'>
                    <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='form-control'
                      placeholder='nqlit2109@gmail.com' />
                    {errors.email && (
                      <div className="alert alert-danger" role="alert">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className='my-2'>
                    <input name='mobile' value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className='form-control'
                      placeholder='0352412318' />
                    {errors.phone && (
                      <div className="alert alert-danger" role="alert">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                  <div className='my-2'>
                    <textarea name='comments' value={comment} onChange={(e) => setComment(e.target.value)} type="text" className='w-100 form-control' placeholder='Nội dụng bạn cần liên hệ với chúng tôi'
                      cols='30'
                      rows='4'
                    />
                    {errors.comment && (
                      <div className="alert alert-danger" role="alert">
                        {errors.comment}
                      </div>
                    )}
                  </div>
                  <div>
                    <button className='button' id='btn-submit' onClick={checkLogin} type='submit'>Gửi yêu cầu</button>
                  </div>
                </div>
                <div className="col-6">
                  <h3 className='contact-title mb-4'>Liên hệ với chúng tôi</h3>
                  <div>
                    <ul className="ps-0">
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineHome className='fs-4' />
                        <address className='m-0'>Thành phố Hồ Chí Minh</address>
                      </li>
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <BiPhoneCall className='fs-4' />
                        <a href="tel: 0352412318">+84 0352412318</a>
                      </li>
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineMail className='fs-4' />
                        <a href="mailto: nqlit2109@gmail.com ">nqlit2109@gmail.com</a>
                      </li>
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineInfoCircle className='fs-4' />
                        <p className='mb-0'>Thứ hai - Thứ sáu, 8 sáng - 5 chiều</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default Contact