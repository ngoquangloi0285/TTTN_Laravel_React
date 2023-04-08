import React from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta';
import { AiOutlineHome,AiOutlineMail, AiOutlineInfoCircle } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";

const Contact = () => {
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
              <div className="content-wrapper d-flex justify-content-between shadow">
                <div className="col-6">
                  <h3 className='contact-title mb-4'>Contact</h3>
                  <form action='' className='d-flex flex-column gap-15' method='POST'>
                    <div>
                      <input name='name' type="text" className='form-control' placeholder='Name'/>
                    </div>
                    <div>
                      <input name='email' type="text" className='form-control'
                      placeholder='Email' />
                    </div>
                    <div>
                      <input name='mobile' type="tel" className='form-control'
                      placeholder='Mobile Number' />
                    </div>
                    <div>
                      <textarea name='comments' type="text" className='w-100 form-control' placeholder='Comments'
                      cols='30'
                      rows='4'
                      />
                    </div>
                    <div>
                      <button className='button' type='submit'>Submit</button>
                    </div>
                  </form>
                </div>
                <div className="col-6">
                  <h3 className='contact-title mb-4'>Get in touch with Us</h3>
                  <div>
                    <ul className="ps-0">
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineHome className='fs-4'/>
                        <address className='m-0'>Ho Chi Minh city</address>
                        </li>
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <BiPhoneCall className='fs-4'/>
                        <a href="tel: 0352412318">+84 0352412318</a>
                        </li>
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineMail className='fs-4'/>
                        <a href="mailto: nqlit2109@gmail.com ">nqlit2109@gmail.com</a>
                        </li>
                      <li className='mb-3 d-flex align-items-center gap-10'>
                        <AiOutlineInfoCircle className='fs-4'/>
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