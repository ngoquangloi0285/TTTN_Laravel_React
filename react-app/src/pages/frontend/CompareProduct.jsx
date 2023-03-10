import React from 'react'
import Color from '../../components/frontend/Color'
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
            <div className="col-4 mb-3">
              <div className="compare-product-card shadow position-relative">
                <img className='position-absolute img-fluid cross'
                  src="images/cross.svg" alt="cross" />
                <div className="product-card-image">
                  <img src="images/watch.jpg" alt="" />
                </div>
                <div className="product-card-detail">
                  <h5 className='title'>
                    Honor T1 7.0 1 GB RAM 8 GB ROM Inch With Wi-Fi+3G Tablet
                  </h5>
                  <div class="accordion accordion-flush" id="accordionFlushExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne1" aria-expanded="false" aria-controls="flush-collapseOne">
                        Products Information...
                        </button>
                      </h2>
                      <div id="flush-collapseOne1" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
                      </div>
                    </div>
                  </div>
                  <h6 className="price mt-3">$ 100</h6>
                  <div className="product-detail">
                    <h5>Brand:</h5>
                    <p>Xiaomi</p>
                  </div>
                  <div className="product-detail">
                    <h5>Type:</h5>
                    <p>Xiaomi</p>
                  </div>
                  <div className="product-detail">
                    <h5>SKU:</h5>
                    <p>HSKU</p>
                  </div>
                  <div className="product-detail">
                    <h5>Availablity:</h5>
                    <p className='m-0 px-2 text-white bg-success'>In Stock</p>
                  </div>
                  <div className="product-detail">
                    <h5>Color:</h5>
                    <Color />
                  </div>
                  <div className="product-detail">
                    <h5>Size:</h5>
                    <div className="d-flex gap-10">
                      <p>S</p>
                      <p>M</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 mb-3">
              <div className="compare-product-card shadow position-relative">
                <img className='position-absolute img-fluid cross'
                  src="images/cross.svg" alt="cross" />
                <div className="product-card-image">
                  <img src="images/watch.jpg" alt="" />
                </div>
                <div className="product-card-detail">
                  <h5 className='title'>
                    Honor T1 7.0 1 GB RAM 8 GB ROM Inch With Wi-Fi+3G Tablet
                  </h5>
                  <div class="accordion accordion-flush" id="accordionFlushExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne2" aria-expanded="false" aria-controls="flush-collapseOne">
                        Products Information...
                        </button>
                      </h2>
                      <div id="flush-collapseOne2" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
                      </div>
                    </div>
                  </div>
                  <h6 className="price mt-3">$ 100</h6>
                  <div className="product-detail">
                    <h5>Brand:</h5>
                    <p>Xiaomi</p>
                  </div>
                  <div className="product-detail">
                    <h5>Type:</h5>
                    <p>Xiaomi</p>
                  </div>
                  <div className="product-detail">
                    <h5>SKU:</h5>
                    <p>HSKU</p>
                  </div>
                  <div className="product-detail">
                    <h5>Availablity:</h5>
                    <p className='m-0 px-2 text-white bg-success'>In Stock</p>
                  </div>
                  <div className="product-detail">
                    <h5>Color:</h5>
                    <Color />
                  </div>
                  <div className="product-detail">
                    <h5>Size:</h5>
                    <div className="d-flex gap-10">
                      <p>S</p>
                      <p>M</p>
                    </div>
                  </div>
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