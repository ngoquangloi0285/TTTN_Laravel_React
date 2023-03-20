import React, { useState, useEffect } from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingOverlay from 'react-loading-overlay'

const ChangePassword = () => {
  // set data
  const [current_password, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");

  const { changepassword, errors, status, isLoading } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    changepassword({ current_password, password })
    setCurrentPassword("")
    setNewPassword("")
    console.log(errors)
  }

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
                {status && 
                <div class="alert alert-success py-2 text-center" role="alert">
                  {status}
                </div>
                }
                <form action="" onSubmit={handleSubmit} className='d-flex flex-column gap-15'>
                  <div>
                    <input value={current_password} onChange={(e) => setCurrentPassword(e.target.value)} type="password"
                      id='old_password' minLength="8" placeholder='Current password' className="form-control" />
                    {errors.current_password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.current_password[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input value={password} onChange={(e) => setNewPassword(e.target.value)} type="password" minLength="8"
                      id='new_password' placeholder='Change password' className="form-control" />
                    {errors.password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password[0]}</span>
                      </div>}
                  </div>
                  <div className='text-center btn-forgot'>
                    <LoadingOverlay className='text-danger'
                      spinner
                      active={isLoading}
                      text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
                      }
                    ></LoadingOverlay>
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

export default ChangePassword