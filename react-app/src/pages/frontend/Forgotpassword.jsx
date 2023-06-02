import React, { useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { Link, useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'

const Forgotpassword = () => {
  const [email, setEmail] = useState();
  const [errors, setError] = useState([]);
  const [status, setStatus] = useState(null);
  const { csrf } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const btn = document.getElementById('btn-submit');

    await csrf;
    setError([])
    setStatus(null)
    setIsLoading(true);
    try {
      btn.innerHTML = "Đang gửi...";
      const response = await axios.post('/forgot-password', { email })
      setIsLoading(false);
      setStatus(response.data.status)
      setEmail("")
      btn.innerHTML = "Quên mật khẩu";
    } catch (e) {
      setIsLoading(false);
      if (e.response.status === 422) {
        setError(e.response.data.errors)
      }
      btn.innerHTML = "Quên mật khẩu";
    }
  }
  return (
    <>
      <Meta title={"Đặt lại mật khẩu"} />
      <Maps title="Đặt lại mật khẩu" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
              {status && <div class="alert alert-success bg-success text-center" role="alert">
                  {status}
                </div>}
                <h3 className='text-center'>Quên mật khẩu</h3>
                <p className="text-center">
                Chúng tôi sẽ gửi cho bạn một thư để đặt lại mật khẩu của bạn
                </p>
                <form action="" onSubmit={handleSubmit} className='d-flex flex-column gap-15'>
                  <div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='nqlit2109@gmail.com' className="form-control" />
                    {errors.email &&
                      <div className="d-flex">
                        <span className="text-error">{errors.email[0]}</span>
                      </div>}
                  </div>
                  <div className='btn-forgot text-center'>
                  {/* <LoadingOverlay className='text-danger'
                      spinner
                      active={isLoading}
                      text={<button type='submit' className='button btn-login text-white bg-dark'>Đang gửi...</button>
                      }
                    ></LoadingOverlay> */}
                    <button type='submit' id='btn-submit' className='button btn-login'>Quên mật khẩu</button>
                    <div className='text-center'>
                      <Link to="../login">Hủy</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Forgotpassword