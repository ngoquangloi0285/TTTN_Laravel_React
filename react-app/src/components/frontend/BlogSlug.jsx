import React, { useEffect, useState } from 'react'
import axios from '../../api/axios';
import BlogCart from './BlogCard';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import DOMPurify from 'dompurify';

const BlogSlug = (props) => {
    const slug = props.slug;
    console.log(slug)
    const [newstList, setNewsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewsLoaded, setIsNewsListLoaded] = useState(false); // Thêm state mới
    const [categoryMap, setCategoryMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsResponse, categoryResponse] = await Promise.all([
                    axios.get(`/api/news/v1/news_detail`, {
                        params: {
                            slug: slug,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get('/api/category/v1/category'),

                ]);
                const newCategoryMap = {};
                categoryResponse.data.forEach((category) => {
                    newCategoryMap[category.id] = category.name_category;
                });
                setCategoryMap(newCategoryMap);

                setNewsList(newsResponse.data);
                setIsLoading(false);
                setIsNewsListLoaded(true); // Cập nhật trạng thái đã tải xong news

            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (isNewsLoaded) {
            var parentImg = document.getElementById("parentImg");
            var childrenImg = document.getElementsByClassName('children-img');
            var intervalId;

            function changeImage(index) {
                parentImg.src = childrenImg[index].src;
            }

            function stopAutoChange() {
                clearInterval(intervalId);
            }
            for (var i = 0; i < childrenImg.length; i++) {
                childrenImg[i].addEventListener('mouseover', function () {
                    var hoveredIndex = Array.prototype.indexOf.call(childrenImg, this);
                    changeImage(hoveredIndex);
                    stopAutoChange();
                });
            }
        }
    }, [isNewsLoaded]);

    return (
        <div>
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
                    <div div className="single-product store-wrapper home-wrapper-2 py-5">
                        <div className="container-xxl">
                            <div className="row">
                                <div className="col-12">
                                    <p className="text-dark m-0">
                                        {categoryMap[newstList.category_id]}
                                    </p>
                                    <h1>{newstList.title_news}</h1>
                                </div>
                            </div>
                            <div className="row blog_overflow">
                                <img id="parentImg" src={`http://localhost:8000/storage/news/${newstList.image}`} alt={newstList.title_news} />
                                <div className="small-img-row">
                                    {
                                        newstList.images.map((news) => (
                                            <div style={{ cursor: 'pointer' }} className="small-img-col">
                                                <img className='children-img' src={`http://localhost:8000/storage/news/${news.image}`} alt={news.image} width="100%" />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='content_detail'>
                                    <div className="row blog_overflow">
                                        <div className=''>
                                            <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newstList.content_news) }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div >
                )
            }
        </div>
    )
}

export default BlogSlug