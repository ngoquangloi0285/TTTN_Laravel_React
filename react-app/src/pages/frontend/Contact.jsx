import React, { useState } from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta';
import { AiOutlineHome, AiOutlineMail, AiOutlineInfoCircle, AiOutlineClear } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import axios from '../../api/axios';
import Swal from 'sweetalert2';

const Contact = () => {

  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const handleUpload = (event) => {
    event.preventDefault();
    const fileList = event.target.files;
    const newFiles = Array.from(fileList);
    const shouldAddFiles = newFiles.filter(file => !files.some(f => f.name === file.name));
    setFiles([...files, ...shouldAddFiles]);

    const newPreviewUrls = shouldAddFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const renderPreview = () => {
    return previewUrls.map((url) => {
      return (
        <div className='col-4' key={url}>
          <img className='img-thumbnail' src={url} alt='Preview' />
        </div>
      );
    });
  };

  const clearImageUrls = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFiles([]);
  };

  const ClearUpPhotos = () => {
    document.getElementById("file").value = "";
    clearImageUrls();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');

    // Xử lý khi người dùng ấn nút Submit

    // định nghĩa lỗi
    const newErrors = {};

    if (!name) {
      newErrors.name = "Vui lòng nhập tên của bạn.";
    }
    if (!email) {
      newErrors.email = "Vui lòng nhập Email của bạn.";
    }
    if (!phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại của bạn.";
    }
    if (!comment) {
      newErrors.comment = "Vui lòng để lại lời nhắn của bạn.";
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
      setStatus("chúng tôi sẽ liên hệ với bạn sớm nhất!")
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

  return (
    <>
      <Meta title={"Contact US"} />
      <Maps title="Contact US" />
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
                  <h3 className='contact-title mb-4'>Contact</h3>
                  <form action='' className='d-flex flex-column gap-15' method='POST'>
                    <div>
                      <input name='name' value={name} onChange={(e) => setName(e.target.value)} type="text" className='form-control' placeholder='Name' />
                      {errors.name && (
                        <div className="alert alert-danger" role="alert">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='form-control'
                        placeholder='Email' />
                      {errors.email && (
                        <div className="alert alert-danger" role="alert">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <input name='mobile' value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className='form-control'
                        placeholder='Mobile Number' />
                      {errors.phone && (
                        <div className="alert alert-danger" role="alert">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <textarea name='comments' value={comment} onChange={(e) => setComment(e.target.value)} type="text" className='w-100 form-control' placeholder='Comments'
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
                      <button className='button' id='btn-submit' onClick={handleSubmit} type='submit'>Submit</button>
                    </div>
                  </form>
                </div>
                <div className="col-6">
                  <h3 className='contact-title mb-4'>Get in touch with Us</h3>
                  <div>
                    <ul className="ps-0">
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineHome className='fs-4' />
                        <address className='m-0'>Ho Chi Minh city</address>
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
                        <p className='mb-0'>Monday - Friday, 8 AM - 5 PM</p>
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