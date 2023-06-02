import React, { useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errors, status, isLoading, logout } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    logout();
    await login({ email, password })
  }
  return (
    <>
      <Meta title={"Đăng nhập"} />
      <Maps title="Đăng nhập" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Đăng nhập</h3>
                {status &&
                  <div class="p-0  border-0 alert alert-success bg-success text-center" role="alert">
                    {status}
                  </div>}
                <form action="" onSubmit={handleLogin} className='d-flex flex-column gap-15'>
                  <div>
                    <input type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='nqlit2109@gmail.com' className="form-control" />
                    {errors.email &&
                      <div className="d-flex">
                        <span className="text-error">{errors.email[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength="8" placeholder='Mật khẩu của bạn' className="form-control" />
                    {errors.password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password[0]}</span>
                      </div>}
                  </div>
                  <div className='d-flex gap-10'>
                    <Link to="../forgot-password">Bạn quên mật khẩu?</Link>
                    <Link to="../signup">Đăng kí tài khoản
                    </Link>
                  </div>
                  <div className='d-flex justify-content-center gap-10 align-items-center'>
                    <button type='submit' className='button btn-login'>
                      {isLoading === false ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

export default Login