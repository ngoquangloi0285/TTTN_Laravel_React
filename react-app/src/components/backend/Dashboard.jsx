import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <Link style={{padding: '2rem'}} to='../admin'>Dashboard</Link>
      <Link to="new-product" style={{display: 'block'}}>New Product</Link>
      <Link to="edit-product" style={{display: 'block'}}>Edit Product</Link>
      <Link to="update-product" style={{display: 'block'}}>Update Product</Link>
      <Link to="trash-product" style={{display: 'block'}}>Trash Product</Link>
      <Outlet/>
    </div>
  )
}

export default Dashboard