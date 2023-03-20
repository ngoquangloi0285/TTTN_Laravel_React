import React, { useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errors, status, isLoading } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    // console.log(isLoading)
    login({ email, password })
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
                {status && 
                <div class="bg-succes py-5 text-center" role="alert">
                  {status}
                </div>
                }
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
                    <Link to="../signup">Signup
                    </Link>
                  </div>
                  <div className='d-flex justify-content-center gap-10 align-items-center'>
                  <LoadingOverlay className='text-danger'
                      spinner
                      active={isLoading}
                      text={<button type='submit' className='button btn-login text-white bg-success'>Loading data...</button>
                      }
                    ></LoadingOverlay>
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