import React from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../../components/frontend/BlogCard";
import ProductCard from "../../components/frontend/ProductCard";
import SpecialProducts from "../../components/frontend/SpecialProducts";
import Suggestions from "../../components/frontend/Suggestions";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Meta from '../../components/frontend/Meta';

const slideImages = [
  { url: 'http://localhost:3000/images/main-banner.jpg', title: 'main-banner.jpg' },
  { url: 'http://localhost:3000/images/main-banner-1.jpg', title: 'main-banner.jpg' },
];

const Home = () => {
  
  return (
    <>
      <Meta title={"Home"} />
      <section className="home-wrapper-2 py-5">
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
                        </div>
                      ))}
                    </Slide>
                  </div>
                  <div className="main-banner-content position-absolute">
                    <h4>SUPERCHANRGRED FOR PROS.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>From $999.00 or $41.62/mo.</p>
                    <Link className="button">BUY NOW</Link>
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
      <section className="home-wrapper-2 py-5">
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
      <section className="home-wrapper-3 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="categories d-flex flex-wrap align-items-center justify-content-between">
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart TV</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/tv.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart Wactches</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/headphone.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart TV</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/tv.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Smart Wactches</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/headphone.jpg" alt="" />
                </div>
                <div className="d-flex gap-30 align-items-center">
                  <div>
                    <h6>Cameras</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="featured-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Popular Products</h3>
            </div>
            <div className="row">
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </div>
          </div>
        </div>
      </section>
      <section className="famous-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Suggestions for you</h3>
            </div>
            <Suggestions />
            <Suggestions />
            <Suggestions />
            <Suggestions />
          </div>
        </div>
      </section>
      <div className="special-wrapper py-5 hom-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Special  Products</h3>
            </div>
            <div className="row">
              <SpecialProducts />
              <SpecialProducts />
              <SpecialProducts />
              <SpecialProducts />
            </div>
          </div>
        </div>
      </div>
      <section className="marque-wrapper py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="marquee-inner-wrapper bg-white py-3 card-wrapper">
                <Marquee className="d-flex">
                  <div className="mx-4 w-25">
                    <img src="images/brand-01.png" alt="brand" />
                  </div>
                  <div className="mx-4 w-25">
                    <img src="images/brand-02.png" alt="brand" />
                  </div>
                  <div className="mx-4 w-25">
                    <img src="images/brand-03.png" alt="brand" />
                  </div>
                  <div className="mx-4 w-25">
                    <img src="images/brand-04.png" alt="brand" />
                  </div>
                  <div className="mx-4 w-25">
                    <img src="images/brand-05.png" alt="brand" />
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Latest Blogs</h3>
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
            <div className="gr-4 shadow mb-4">
              <BlogCard />
            </div>
            <div className="gr-4 shadow mb-4">
              <BlogCard />
            </div>
            <div className="gr-4 shadow mb-4">
              <BlogCard />
            </div>
            <div className="gr-4 shadow mb-4">
              <BlogCard />
            </div>
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