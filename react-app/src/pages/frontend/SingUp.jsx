import React, { useEffect, useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'
import bcrypt from 'bcryptjs';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const { register, errors, isLoading } = useAuthContext();

  const handleSignUp = async (event) => {
    // const hashedPassword = bcrypt.hashSync(password, 10);
    // const handedPasswordConfirmation = bcrypt.hashSync(password_confirmation, 10);
    event.preventDefault();
    register({ name, email, password, password_confirmation })
  }

  return (
    <>
      <Meta title={"Đăng ký tài khoản"} />
      <Maps title="Đăng ký tài khoản" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Đăng ký tài khoản</h3>
                <form action="" onSubmit={handleSignUp} className='d-flex flex-column gap-15'>
                  <div>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Ngô Quang Lợi' className="form-control" />
                    {errors.name &&
                      <div className="d-flex">
                        <span className="text-error">{errors.name[0]}</span>
                      </div>}
                  </div>
                  <div className='auth-note'>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='nqlit2109@gmail.com' className="form-control" />
                    {errors.email &&
                      <div className="d-flex">
                        <span className="text-error">{errors.email[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength="8" placeholder='Mật khẩu của bạn' className="form-control" />
                    {errors.password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" minLength="8" placeholder='Xác nhận mật khẩu' className="form-control" />
                    {errors.password_confirmation &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password_confirmation[0]}</span>
                      </div>}
                  </div>
                  <div className='d-flex gap-10'>
                    <p>Bạn có sẳn tài khoản? <span>
                      <Link className='text-white' to="../login">Đăng nhập
                      </Link>
                    </span></p>
                  </div>
                  <div className='d-flex justify-content-center gap-10 align-items-center'>
                    <button type='submit' className='button btn-login'>
                      {isLoading === false ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
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

export default Signup