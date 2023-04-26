import React, { useState } from 'react'
import { Link } from 'wouter';
import Meta from '../frontend/Meta';
import Maps from '../frontend/Maps';
import useAuthContext from '../../context/AuthContext';

const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, errors, status, isLoading, logout } = useAuthContext();
  
    const handleLogin = async (event) => {
    //   event.preventDefault();
      logout()
      await login({ email, password })
    }
    return (
      <>
        <Meta title={"Login Admin"} />
        <Maps title="Login Admin" />
        <div className="login-wrapper py-5 home-wrapper-2">
          <div className="container-xxl">
            <div className="row">
              <div className="col-12">
                <div className="auth-card">
                  <h3 className='text-center'>Login Admin</h3>
                  {status &&
                    <div class="p-0  border-0 alert alert-success bg-success text-center" role="alert">
                      {status}
                    </div>}
                  <form action="" onSubmit={handleLogin} className='d-flex flex-column gap-15'>
                    <div>
                      <input type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email or Phone' className="form-control" />
                      {errors.email &&
                        <div className="d-flex">
                          <span className="text-error">{errors.email[0]}</span>
                        </div>}
                    </div>
                    <div>
                      <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="8" placeholder='Password' className="form-control" />
                      {errors.password &&
                        <div className="d-flex">
                          <span className="text-error">{errors.password[0]}</span>
                        </div>}
                    </div>
                    <div className='d-flex gap-10'>
                      <Link to="../forgot-password">Forgot Password?</Link>
                    </div>
                    <div className='d-flex justify-content-center gap-10 align-items-center'>
                      <button type='submit' className='button btn-login'>
                      {isLoading === false ? 'Logging...' : 'Login'}
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

export default LoginAdmin