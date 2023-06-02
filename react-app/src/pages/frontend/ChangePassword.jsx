import React, { useState, useEffect } from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'
import LoadingOverlay from 'react-loading-overlay'

const ChangePassword = () => {
  // set data
  const [current_password, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const { changepassword, errors, isLoading } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    changepassword({ current_password, password, password_confirmation })
    setCurrentPassword("")
    setNewPassword("");
    setPasswordConfirmation("");
  }

  return (
    <>
      <Meta title={"Thay đổi mật khẩu"} />
      <Maps title="Thay đổi mật khẩu" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
                <h3 className='text-center'>Thay đổi mật khẩu</h3>
                <form action="" onSubmit={handleSubmit} className='d-flex flex-column gap-15'>
                  <div>
                    <input value={current_password} onChange={(e) => setCurrentPassword(e.target.value)} type="password"
                      id='old_password' minLength="8" placeholder='Mật khẩu hiện tại' className="form-control" />
                    {errors.current_password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.current_password[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input value={password} onChange={(e) => setNewPassword(e.target.value)} type="password" minLength="8"
                      id='new_password' placeholder='Mật khẩu thay đổi' className="form-control" />
                    {errors.password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" minLength="8"
                      id='new_password' placeholder='Xác nhận mật khẩu' className="form-control" />
                    {errors.password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password[0]}</span>
                      </div>}
                  </div>
                  <div className='text-center btn-forgot'>
                    <button type='submit' className='button btn-login'>
                      {isLoading === false ? 'Đang thay đổi...' : 'Thay đổi'}
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

export default ChangePassword