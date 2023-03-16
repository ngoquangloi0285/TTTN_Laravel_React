import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {

  return (
    <>
      <div className='not-found'>
        <h1 className='text-danger'>Not Found - 404</h1>
        <Link className='not-found ' to="/">Come Back Home</Link>
      </div>
    </>
  )
}

export default NotFound