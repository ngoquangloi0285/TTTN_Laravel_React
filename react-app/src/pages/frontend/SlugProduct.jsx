import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router';
import { getProduct } from '../../globalState';
import { Link } from 'wouter';
import axios from '../../api/axios';
import ReactStars from "react-rating-stars-component";
import { ProductList } from '../../components/frontend/ProductCard';
import CategoryProduct from '../../components/frontend/CategoryProduct';

const SlugProduct = () => {
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };
    const { slug } = useParams(); // lấy ID từ URL

    return (
        <>
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="filter-sort-gird mb-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="products-list pd-5">
                                    <CategoryProduct slug={slug} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlugProduct