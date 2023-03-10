import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <Link style={{padding: '2rem'}} to='../admin'>Dashboard</Link>
      <Link to="products">Products</Link>
      <Outlet/>
    </div>
  )
}

export default Dashboard