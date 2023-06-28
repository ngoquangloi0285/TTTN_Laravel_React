import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../../components/frontend/BlogCard";
import { BrandList, ProductList, RandomProduct, SlideShow, SpecialProducts } from "../../components/frontend/ProductCard";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Meta from '../../components/frontend/Meta';
import axios from "../../api/axios";
import { setCountProduct } from "../../globalState";
import ReactStars from "react-rating-stars-component";
import { ImageList } from "@mui/material";

const Home = () => {

  return (
    <>
      <Meta title={"Home"} />
      <section className="home-wrapper-2 py-4">
        <div className="container-xxl">
          <div className="row">
            <SlideShow />
            <div className="row">
              <div className="container-xxl py-3">
                <div className="random-product d-flex gap-3">
                  {/* <RandomProduct random_product='random_product' /> */}
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
                    <h6>Miễn phí vận chuyển</h6>
                    <p className="mb-0">Từ tất cả các đơn đặt hàng 150.000đ</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-02.png" alt="service" />
                  <div>
                    <h6>Ưu đãi bất ngờ hàng ngày</h6>
                    <p className="mb-0">Tiết kiệm tới 25%</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-03.png" alt="service" />
                  <div>
                    <h6>Hổ trợ 24/7</h6>
                    <p className="mb-0">Mua sắm với một chuyên gia</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-04.png" alt="service" />
                  <div>
                    <h6>Giá cả phải chăng</h6>
                    <p className="mb-0">Nhận giá mặc định của nhà máy</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15 ">
                  <img src="images/service-05.png" alt="service" />
                  <div>
                    <h6>Thanh toán an toàn</h6>
                    <p className="mb-0">Thanh toán được bảo vệ 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="featured-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="text-danger section-heading">Sản phẩm mới của chúng tôi</h3>
            </div>
            <div className="row">
              <ProductList
                newProduct='new_product'
                saleProduct='product_sale'
              />
            </div>
            <div className="d-flex justify-content-center">
              <Link className="view_more" to='store'>Xem thêm...</Link>
            </div>
          </div>
        </div>
      </section>
      <div className="special-wrapper py-4 hom-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="text-danger section-heading">Sản phẩm đặc biệt</h3>
            </div>
            <div className="row">
              <SpecialProducts special='product_special' />
            </div>
            <div className="d-flex justify-content-center">
              <Link className="view_more" to='store'>Xem thêm...</Link>
            </div>
          </div>
        </div>
      </div>
      <section className="famous-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="text-danger section-heading">Gợi ý cho bạn</h3>
            </div>
            <div className="row">
              <ProductList suggestion='suggestion' />
            </div>
            <div className="d-flex justify-content-center">
              <Link className="view_more" to='store'>Xem thêm...</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="marque-wrapper py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="text-danger section-heading">Thương hiệu đồng hành</h3>
            </div>
            <BrandList />
          </div>
        </div>
      </section>
      <section className="blog-wrapper py-4 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="text-danger section-heading">Tin tức mới nhất của chúng tôi</h3>
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <BlogCard blog="blog" />
            </div>
            <div className="d-flex justify-content-center">
              <Link to='../blog' className="view_more" >Xem thêm...</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;