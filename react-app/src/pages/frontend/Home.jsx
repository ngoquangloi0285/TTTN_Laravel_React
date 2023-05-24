import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../../components/frontend/BlogCard";
import { NewProduct, ProductList } from "../../components/frontend/ProductCard";
import SpecialProducts from "../../components/frontend/SpecialProducts";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Meta from '../../components/frontend/Meta';
import axios from "../../api/axios";
import { setCountProduct } from "../../globalState";
import ReactStars from "react-rating-stars-component";

const slideImages = [
  { url: 'http://localhost:3000/images/main-banner.jpg', title: 'main-banner.jpg' },
  { url: 'http://localhost:3000/images/main-banner-1.jpg', title: 'main-banner.jpg' },
];

const Home = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [brandResponse] = await Promise.all([
          axios.get('/api/brand/v1/brand'),
        ]);
        setBrandList(brandResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Meta title={"Home"} />
      <section className="home-wrapper-2 py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <div className="main-banner position-relative  ">
                <div id="carouselExample" class="carousel slide">
                  <div className="carousel-inner rounded-3 slide-container">
                    <Slide>
                      {slideImages.map(image => (
                        <div className="each-slide carousel-item active" key={image}>
                          <img src={image.url} className="d-block img-fluid" alt="..." />
                          <div className="main-banner-content position-absolute">
                            <h4>SUPERCHANRGRED FOR PROS.</h4>
                            <h5>iPad S13+ Pro.</h5>
                            <p>From $999.00 or $41.62/mo.</p>
                            <Link className="button">BUY NOW</Link>
                          </div>
                        </div>
                      ))}
                    </Slide>
                  </div>

                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-10">
                <div className="small-banner position-relative   ">
                  <img
                    className="img-fluid rounded-3"
                    src="images/catbanner-01.jpg"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>Best sake.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>
                      From $999.00 <br /> $41.62/mo.
                    </p>
                  </div>
                </div>
                <div className="small-banner position-relative   ">
                  <img
                    className="img-fluid rounded-3"
                    src="images/catbanner-02.jpg"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>New arrival.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>
                      From $999.00 <br /> $41.62/mo.
                    </p>
                  </div>
                </div>
                <div className="small-banner position-relative   ">
                  <img
                    className="img-fluid rounded-3"
                    src="images/catbanner-03.jpg"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>New arrival.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>
                      From $999.00 <br /> $41.62/mo.
                    </p>
                  </div>
                </div>
                <div className="small-banner position-relative   ">
                  <img
                    className="img-fluid rounded-3"
                    src="images/catbanner-04.jpg"
                    alt="main-banner"
                  />
                  <div className="small-banner-content position-absolute">
                    <h4>New arrival.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>
                      From $999.00 <br /> $41.62/mo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="home-wrapper-2 py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="servies d-flex align-items-center justify-content-between ">
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service.png" alt="service" />
                  <div>
                    <h6>Free Shipping</h6>
                    <p className="mb-0">From all orders oven $5</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-02.png" alt="service" />
                  <div>
                    <h6>Daily Surprise Offers</h6>
                    <p className="mb-0">Save upto 25% off</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-03.png" alt="service" />
                  <div>
                    <h6>Support 24/7</h6>
                    <p className="mb-0">Shop with an expert</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-04.png" alt="service" />
                  <div>
                    <h6>Affordable Prices</h6>
                    <p className="mb-0">Get Factory Default Price</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-05.png" alt="service" />
                  <div>
                    <h6>Secure Payments</h6>
                    <p className="mb-0">100% Protected Payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="home-wrapper-3 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="categories d-flex flex-wrap align-items-center justify-content-between">
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/camera.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart TV</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/tv.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart Wactches</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/headphone.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/camera.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/camera.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart TV</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/tv.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart Wactches</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/headphone.jpg" alt="" />
                  </Link>
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <Link>
                    <img src="images/camera.jpg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="featured-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our New Products</h3>
            </div>
            <div className="row">
              <ProductList newProduct='new_product' saleProduct='product_sale' />
            </div>
            <div className="d-flex justify-content-center">
              <Link className="view_more" to='store'>View more...</Link>
            </div>
          </div>
        </div>
      </section>
      <div className="special-wrapper py-4 hom-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Special  Products</h3>
            </div>
            <div className="row">
              <SpecialProducts special='product_special' />
            </div>
            <div className="d-flex justify-content-center">
              <Link className="view_more" to='store'>View more...</Link>
            </div>
          </div>
        </div>
      </div>
      <section className="famous-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Suggestions for you</h3>
            </div>
            <div className="row">
              <ProductList suggestion='suggestion' />
            </div>
            <div className="d-flex justify-content-center">
              <Link className="view_more" to='store'>View more...</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="marque-wrapper py-4">
        <div className="container-xxl">
          <div className="row">
            
            <div className="col-12">
              <div className="marquee-inner-wrapper bg-white py-3 card-wrapper">
                {
                  isLoading ? (
                    <div className="row">
                      {/* <h1>Loading...</h1>
                      <ProductPlaceholder/> */}
                      <div className="card product-card" aria-hidden="true">
                        <img
                          style={
                            {
                              height: '200px',
                            }
                          }
                          src="" className="card-img-top placeholder-glow placeholder" alt="" />
                      </div>
                    </div>
                  ) : (
                    <Marquee className="d-flex">
                      {
                        brandList.map((brand) => (
                          <div className="mx-4 w-25">
                            <img
                              style={
                                {
                                  height: '100px'
                                }
                              }
                              className="img-fluid img-thumbnai" src={`http://localhost:8000/storage/brand/${brand.image}`} alt={brand.name} />
                          </div>
                        ))
                      }
                    </Marquee>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Latest Blogs</h3>
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <div className="gr-4 shadow mb-4">
                <BlogCard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;