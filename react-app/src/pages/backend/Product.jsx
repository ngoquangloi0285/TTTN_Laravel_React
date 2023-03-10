import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Product = () => {
  return (
    <div>Product
      <Link to="new-product" style={{ display: 'block' }}>New Product</Link>
      <Link to="edit-product" style={{ display: 'block' }}>Edit Product</Link>
      <Link to="update-product" style={{ display: 'block' }}>Update Product
      </Link>
      <Link to="trash-product" style={{ display: 'block' }}>Trash Product</Link>
      <Outlet />
    </div>
  )
}

export default Product