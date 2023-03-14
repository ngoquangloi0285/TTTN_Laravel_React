import React from 'react'
import { Link } from 'react-router-dom'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const Forgotpassword = () => {
  return (
    <>
      <Meta title={"Forgot Password"} />
      <Maps title="Forgot Password" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Forgot Password</h3>
                <p className="text-center">
                  We will send you an mail to reset your password
                </p>
                <form action="" className='d-flex flex-column gap-15'>
                  <div>
                    <input type="email" placeholder='Enter your Email' className="form-control" />
                  </div>
                  <div className='btn-forgot text-center'>
                    <button type='submit' className='button btn-login'>Submit</button>
                    <div className='text-center'>
                      <Link to="../login">Cancel</Link>
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