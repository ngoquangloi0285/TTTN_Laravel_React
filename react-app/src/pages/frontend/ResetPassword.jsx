import React, { useState, useEffect } from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'

const ResetPassword = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [password_confirmation, setPasswordConfirmation] = useState();
  const [errors, setError] = useState([]);
  const [status, setStatus] = useState(null);
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const { csrf } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    setEmail(searchParams.get('email'));
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    await csrf;
    setError([])
    setStatus(null)
    try {
      const response = await axios.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation
      })
      setStatus(response.data.status)
      setEmail("")
      setPassword("")
      setPasswordConfirmation("")
    } catch (e) {
      if (e.response.status === 422) {
        setError(e.response.data.errors)
      }
    }
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
                {status && <div class="alert alert-success bg-success text-center" role="alert">
                  {status}
                  <div className='text-center'>
                      Go to <Link to="../login">Login</Link>
                    </div>
                </div>}
                <h3 className='text-center'>Change Password</h3>
                <form action="" onSubmit={handleSubmit} className='d-flex flex-column gap-15'>
                  <div>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength="8" placeholder='Current password' className="form-control" />
                    {errors.password &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password[0]}</span>
                      </div>}
                  </div>
                  <div>
                    <input value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" minLength="8" placeholder='Change password' className="form-control" />
                    {errors.password_confirmation &&
                      <div className="d-flex">
                        <span className="text-error">{errors.password_confirmation[0]}</span>
                      </div>}
                  </div>
                  <div className='text-center btn-forgot'>
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