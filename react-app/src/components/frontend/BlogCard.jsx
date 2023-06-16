import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios';
import { format } from 'date-fns';
const BlogCart = (props) => {
    const slug = props.blog;
    const [isLoading, setIsLoading] = useState(true);

    console.log('tin tức',slug);
    const [newsList, setNewList] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get('/api/news/v1/news', {
                    params: {
                        blog: slug,
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // Chuyển đổi giá trị create_at thành "1 Dec, 2023"
                const formattedData = data.map((newsItem) => ({
                    ...newsItem,
                    create_at: format(new Date(newsItem.created_at), "d MMM, yyyy"),
                }));
                setNewList(formattedData);
                console.log(formattedData);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    return (
        <>
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
                    newsList.map((news) => (
                        <div className="gr-4 shadow mb-4">
                            <div className='blog-card'>
                                <div className="card-img">
                                    <img className='img-fluid w-100' src={`http://localhost:8000/storage/news/${news.image}`} alt={news.title_news} />
                                </div>
                            </div>
                            <div className='blog-content'>
                                <p className='date'>{format(new Date(news.create_at), "d MMM, yyyy")}</p>
                                <h5 className='title'>
                                    {news.title_news}
                                </h5>
                                <p className='des'>
                                    {news.description}
                                </p>
                                <Link to={`../blog/${news.slug}`} className='button blog-btn'>Đọc thêm</Link>
                            </div>
                        </div>
                    ))
                )
            }

        </>
    )
}

export default BlogCart