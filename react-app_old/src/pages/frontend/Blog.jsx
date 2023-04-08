import React from 'react'
import { Link } from 'react-router-dom';
import Maps from '../../components/frontend/Maps';
import Meta from '../../components/frontend/Meta';
import BlogCard from '../../components/frontend/BlogCard';

const Blog = () => {
  return (
    <>
      <Meta title={"Blog"} />
      <Maps title="Blog" />
      <div className="blog-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="filter-card mb-3">
                <h3 className="filter-title">
                  Find By Categories
                </h3>
                <div className='container'>
                  <div className="row filter-mx">
                    <div className="col-3">
                      <ul className="ps-0">
                        <li><Link to="">Watch</Link></li>
                        <li><Link to="">TV</Link></li>
                        <li><Link to="">Camera</Link></li>
                        <li><Link to="">Laptop</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="row">
                <div className='col-6 mb-3'>
                  <BlogCard />
                </div>
                <div className='col-6 mb-3'>
                  <BlogCard />
                </div>
                <div className='col-6 mb-3'>
                  <BlogCard />
                </div>
                <div className='col-6 mb-3'>
                  <BlogCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Blog