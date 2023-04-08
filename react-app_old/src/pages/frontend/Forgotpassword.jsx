import React, { useState } from 'react'
import LoadingOverlay from 'react-loading-overlay'
import { Link, useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'
import useAuthContext from '../../context/AuthContext'

const Forgotpassword = () => {
  const [email, setEmail] = useState();
  const [errors, setError] = useState([]);
  const [status, setStatus] = useState(null);
  const { csrf } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await csrf;
    setError([])
    setStatus(null)
    setIsLoading(true);
    try {
      const response = await axios.post('/forgot-password', { email })
      setIsLoading(false);
      setStatus(response.data.status)
      setEmail("")
    } catch (e) {
      setIsLoading(false);
      if (e.response.status === 422) {
        setError(e.response.data.errors)
      }
    }
  }
  return (
    <>
      <Meta title={"Forgot Password"} />
      <Maps title="Forgot Password" />
      <div className="login-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="auth-card">
              {status && <div class="alert alert-success bg-success text-center" role="alert">
                  {status}
                </div>}
                <h3 className='text-center'>Forgot Password</h3>
                <p className="text-center">
                  We will send you an mail to reset your password
                </p>
                <form action="" onSubmit={handleSubmit} className='d-flex flex-column gap-15'>
                  <div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter your Email' className="form-control" />
                    {errors.email &&
                      <div className="d-flex">
                        <span className="text-error">{errors.email[0]}</span>
                      </div>}
                  </div>
                  <div className='btn-forgot text-center'>
                  <LoadingOverlay className='text-danger'
                      spinner
                      active={isLoading}
                      text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
                      }
                    ></LoadingOverlay>
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