import React, { useEffect, useState } from 'react'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import './ratingForm.css'
import { AiFillLike } from 'react-icons/ai'
import useAuthContext from '../../context/AuthContext'
import axios from '../../api/axios'

const CommentRating = ({ product_id }) => {
  const { currentUser, logout } = useAuthContext();
  const user_id = currentUser?.id;
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`/api/review/v1/ratings?product_id=${product_id}`);
        setRatings(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRatings();
  }, [product_id, user_id]);

  return (
    <>
      {/* Render danh sách đánh giá */}
      {ratings.map((rating) => (
        <div className="col-4" key={rating.id}>
          <div className="rating-card">
            <div className="rating-avatar">
              {!rating.user.avatar ?
                <img src="https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang-den.png" alt="null" /> :
                <img src={`http://localhost:8000/storage/user/${rating.user.avatar}`} alt={rating.user.avatar} />
              }
              {/* <img src={rating.avatar} alt="" /> */}
            </div>
            <div className="rating-main">
              <div className="rating-name">{rating.user.name}</div>
              <div className="rating-number">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    style={{ color: index + 1 <= rating.rating ? '#ffd700' : '#ccc', fontSize: '20px' }}
                  />
                ))}
                {rating.rating % 1 !== 0 && (
                  <FaStarHalf style={{ color: '#ffd700', fontSize: '20px' }} />
                )}
              </div>
              <div className="rating-time">
                {rating.created_at.substring(0, 10)}
              </div>
              <div className="rating-comment">{rating.content}</div>
            </div>
          </div>
        </div>
      ))}
    </>

  )
}

export default CommentRating