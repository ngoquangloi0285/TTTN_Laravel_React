import React from 'react'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import './ratingForm.css'
import { AiFillLike } from 'react-icons/ai'

const CommentRating = () => {
  return (
    <>
      <div className="col-4">
        <div className="rating-card">
          <div className="rating-avatar">
            <img src="https://down-vn.img.susercontent.com/file/sg-11134004-7qvfo-lhfymzs83bamac_tn" alt="" />
          </div>
          <div className="rating-main">
            <div className="rating-name">
              Ngô Quang Lợi
            </div>
            <div className="rating-number">
              <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
              <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
              <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
              <FaStar style={{ color: '#ffd700', fontSize: '20px' }} />
              <FaStarHalf style={{ color: '#ffd700', fontSize: '20px' }} />
            </div>
            <div className="rating-time">
              21-09-2023
            </div>
            <div className="rating-comment">
              Sản phẩm rất tốt, tôi rất hài lòngcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc!
            </div>
            <div className="rating-like">
              <AiFillLike />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommentRating