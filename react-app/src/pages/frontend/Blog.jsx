import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Maps from '../../components/frontend/Maps';
import Meta from '../../components/frontend/Meta';
import BlogCard from '../../components/frontend/BlogCard';
import axios from '../../api/axios';
import './blog.css'

const Blog = () => {
  const { slug } = useParams();
  console.log(slug);
  const [categoryList, setCategoryList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const [filter, setFilter] = useState('');
  const typeNews = 'other_news';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [categoryResponse, newsResponse] = await Promise.all([
        axios.get('/api/category/v1/category'),
        axios.get('/api/news/v1/news', {
          params: {
            slug: slug,
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }),
      ]);

      const newCategoryMap = {};
      categoryResponse.data.forEach((category) => {
        newCategoryMap[category.id] = category.name_category;
      });

      setCategoryList(categoryResponse.data);
      setNewsList(newsResponse.data);
      setCategoryMap(newCategoryMap);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = newsList.slice(firstIndex, lastIndex);
  const npage = Math.ceil(newsList.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <>
      <Meta title={"Tin tức"} />
      <Maps title="Tin tức" />
      <div className="blog-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="filter-card mb-3">
                <h3 className="filter-title">
                  Tìm tin tức theo danh mục
                </h3>
                <div className='container'>
                  <div className="row filter-mx">
                    <div className="col-12 blog-category">
                      <ul className="ps-0 menu">
                        {categoryList
                          .filter(category => category.parent_category === 0 && category.status === 1)
                          .map((category) => (
                            <li key={category.id}>
                              <Link
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                to={`../blog/category/${category.slug}`}
                              >
                                {category.name_category}
                              </Link>
                            </li>
                          ))}
                        <li>
                        </li>
                        <li><Link to={`../blog/other-news/${typeNews}`}>Tin tức khác</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="row">
                {/* <BlogCard /> */}
                {
                  isLoading ? (
                    <div className="row">
                      <div className="card product-card" aria-hidden="true">
                        <img
                          style={
                            {
                              height: '200px',
                            }
                          }
                          className="card-img-top placeholder-glow placeholder" alt="" />
                        <div className="card-body">
                          <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </h5>
                          <p className="card-text placeholder-glow">
                            <span className="placeholder col-7"></span>
                            <span className="placeholder col-4"></span>
                            <span className="placeholder col-4"></span>
                            <span className="placeholder col-6"></span>
                            <span className="placeholder col-8"></span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    records.map((news) => (
                      <div className="gr-6 shadow mb-4">
                        <div className='blog-card'>
                          <div className="card-img">
                            <img className='img-fluid w-100'
                              // src={`http://localhost:8000/storage/product/Smart Tivi OLED LG 4K 65 inch 65C2PSA_1686388168_0.jpg`}
                              src={`http://localhost:8000/storage/news/${news.image}`}
                              alt={news.title_news} />
                          </div>
                        </div>
                        <div className='blog-content'>
                          <p className="text-dark m-0">
                            {categoryMap[news.category_id]}
                          </p>
                          {
                            news.type === 'other_news' ?
                              <p className="text-dark m-0">
                                Tin tức khác
                              </p>
                              : ''
                          }
                          <p className='date'>{format(new Date(news.created_at), "d MMM, yyyy")}</p>
                          <h5 className='title'>
                            {news.title_news}
                          </h5>
                          {/* <p className='des'>
                            {news.description}
                          </p> */}
                          <Link to={`../blog/${news.slug}`} className='button blog-btn'>Đọc thêm</Link>
                        </div>
                      </div>
                    ))
                  )
                }
                {/* {
                  newsList.length === 0 && <h1>Không có tin tức!</h1>
                } */}
              </div>
            </div>
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a href="/" className="page-link" onClick={prePage}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
                {numbers.map((n, i) => (
                  <li key={i} className={`page-item ${currentPage === n ? 'active' : ''}`}>
                    <Link className="page-link" onClick={() => changePage(n)}>
                      {n}
                    </Link>
                  </li>
                ))}
                <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
                  <a href="/" className="page-link" onClick={nextPage}>
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
  function prePage(event) {
    event.preventDefault();

    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changePage(id) {
    setCurrentPage(id);
  }
  function nextPage(event) {
    event.preventDefault();

    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  }
}

export default Blog