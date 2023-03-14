import React from 'react'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const Signup = () => {
  return (
    <>
      <Meta title={"Sign Up"} />
      <Maps title="Sign Up" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Sign Up</h3>
                <form action="" className='d-flex flex-column gap-15'>
                  <div>
                    <input type="text" placeholder='Your Name' className="form-control" />
                  </div>
                  <div className='auth-note'>
                    <input type="email" placeholder='Email' className="form-control" />
                    <p><small>*Note: Email or Phone will be your username</small></p>
                  </div>
                  <div className='auth-note'>
                    <input type="text" placeholder='Phone' className="form-control" />
                    <p><small>*Note: Phone or Email will be your username</small></p>
                  </div>
                  <div>
                    <input type="password" minLength="8" placeholder='Password' className="form-control" />
                  </div>
                  <div>
                    <input type="password" minLength="8" placeholder='Confirm password' className="form-control" />
                  </div>
                  <div className='d-flex gap-10'>
                    <p>Already have an account? <span>
                      <Link className='text-white' to="../login">Login</Link>
                    </span></p>
                  </div>
                  <div className='d-flex justify-content-center gap-10 align-items-center'>
                    <button type='submit' className='button btn-login'>Sign Up</button>
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