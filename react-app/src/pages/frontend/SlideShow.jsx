import React, { useCallback, useEffect, useState } from 'react'
import axios from '../../api/axios';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export const SlideShow = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [slideList, setSlideList] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setIsLoading(true);
        try {
            const slideResponse = await axios.get("/api/product/v1/show_slide");
            setSlideList(slideResponse.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const goToPrevSlide = () => {
        setActiveSlide(prevSlide =>
            prevSlide === 0 ? slideList.length - 1 : prevSlide - 1
        );
    };

    const goToNextSlide = useCallback(() => {
        setActiveSlide(prevSlide =>
            prevSlide === slideList.length - 1 ? 0 : prevSlide + 1
        );
    }, [slideList.length]);

    useEffect(() => {
        const timer = setTimeout(goToNextSlide, 7000);
        return () => clearTimeout(timer);
    }, [activeSlide, goToNextSlide]);

    const slideOne = slideList[0];

    return (
        <>
            <div className="slide-container">
                <button id="btn-slide1" onClick={goToPrevSlide}>
                    <AiOutlineDoubleLeft />
                </button>
                <div className="slide">
                    {isLoading ? (
                        <p>Loading....</p>
                    ) : (
                        slideList.map((slide, index) => (
                            <img
                                key={slide.id}
                                src={`http://localhost:8000/storage/product/${slide.image}`}
                                alt={`Slide ${index + 1}`}
                                className={`d-${index === activeSlide ? 'block' : 'none'} transition-slide`}
                            />
                        ))
                    )}
                </div>
                <div className="main-banner-content position-absolute">
                    <h3 style={{ color: '#eb1834' }}>
                        {slideOne?.price &&
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(slideOne?.price)
                        }
                    </h3>
                    <h4>Trả góp 0%.</h4>
                    <h5 className="text-primary">{slideOne?.name_product}</h5>
                    <Link to={`../product-detail/${slideOne?.slug_product}`} className="button">Mua ngay bây giờ</Link>
                </div>
                <button id="btn-slide2" onClick={goToNextSlide}>
                    <AiOutlineDoubleRight />
                </button>
            </div>
        </>
    )
}
