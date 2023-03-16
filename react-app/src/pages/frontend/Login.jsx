import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import axios from '../../api/axios'
import useAuthContext from '../../context/AuthContext'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {login, errors} = useAuthContext();
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const handleLogin = async (event) => {
    event.preventDefault();
    await csrf();
    login({email, password})
  }
  return (
    <>
      <Meta title={"Login"} />
      <Maps title="Login" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Login</h3>
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
                      {errors.email &&
                    <div className="d-flex">
                      <span className="text-error">{errors.password[0]}</span>
                    </div>}
                  </div>
                  <div className='d-flex gap-10'>
                    <Link to="../forgot-password">Forgot Password?</Link>
                    <Link to="../signup">Signup</Link>
                  </div>
                  <div className='d-flex justify-content-center gap-10 align-items-center'>
                    <button type='submit' className='button btn-login'>Login</button>
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