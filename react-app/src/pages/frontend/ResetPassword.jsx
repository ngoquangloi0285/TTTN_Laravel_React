import React from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const ResetPassword = () => {
  return (
    <>
      <Meta title={"Reset Password"} />
      <Maps title="Reset Password" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Change Password</h3>
                <form action="" className='d-flex flex-column gap-15'>
                  <div>
                    <input type="password" minLength="8" placeholder='Current password' className="form-control" />
                  </div>
                  <div>
                    <input type="password" minLength="8" placeholder='Change password' className="form-control" />
                  </div>
                  <div className='d-flex justify-content-center gap-10 align-items-center'>
                    <button type='submit' className='button btn-login'>Change Password</button>
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

export default ResetPassword