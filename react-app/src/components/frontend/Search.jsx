import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import ReactStars from "react-rating-stars-component";
import { Link } from 'wouter';

const Search = () => {

  const navigate = useNavigate();
  const [keyword, setKeyWord] = useState('');
  const sreachHandler = (e) => {
    e.preventDefault()

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      // Thực hiện tìm kiếm sản phẩm với keyword ở đây
    }
  }

  return (
    <>
      <form onSubmit={sreachHandler}>
        <div className="input-group">
          <input
            style={{
              height: '49.6px',
            }}
            type="text"
            className="form-control py-2"
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Tìm kiếm sản phẩm..."
            aria-describedby="basic-addon2"
            onChange={(e) => setKeyWord(e.target.value)}
          />
          <button className="input-group-text py-3" id="basic-addon2">
            <BsSearch className="fs-6" />
          </button>
        </div>
      </form>
    </>
  )
}

export default Search