import React from 'react'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const Login = () => {
  return (
    <div>
      <Meta title={"Login"} />
      <Maps title="Login" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Login</h3>
                <form action="" className='d-flex flex-column gap-15'>
                  <div>
                    <input type="email" placeholder='Email or Phone' className="form-control" />
                  </div>
                  <div>
                    <input type="password" placeholder='Password' className="form-control" />
                  </div>
                  <div className='d-flex gap-10'>
                    <Link to="forgot-password">Forgot Password?</Link>
                    <Link to="forgot-password">Signup</Link>
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
    </div>
  )
}

export default Login