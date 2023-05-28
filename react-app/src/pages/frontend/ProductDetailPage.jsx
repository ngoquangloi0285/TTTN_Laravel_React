import React from 'react'
import ProductDetail from '../../components/frontend/ProductDetail'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const ProductDetailPage = () => {
    return (
        <>
            <Meta title="Product Detail"/>
            <Maps title="Product Detail"/>
            <ProductDetail />
        </>
    )
}

export default ProductDetailPage