import React from 'react'
import Maps from '../../components/frontend/Maps'
import Meta from '../../components/frontend/Meta'

const CompareProduct = () => {
  return (
    <>
      <Meta title={"Compare Product"} />
      <Maps title="Compare roduct" />
      <div className="compare-product-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="compare-product-card position-relative">
                <img className='position-absolute img-fluid cross'
                  src="images/cross.svg" alt="cross" />
                <div className="product-card-image">
                  <img src="images/watch.jpg" alt="" />
                </div>
                <div className="product-card-detail">
                  <h5 className='title'></h5>
                  <h6 className="price"></h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompareProduct