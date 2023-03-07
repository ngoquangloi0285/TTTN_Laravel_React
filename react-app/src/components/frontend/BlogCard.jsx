import React from 'react'
import { Link } from 'react-router-dom'

const BlogCart = () => {
    return (
        <>
            <div className='blog-card'>
                <div className="card-img">
                    <img className='img-fluid w-100' src='images/blog-1.jpg' alt='' />
                </div>
            </div>
            <div className='blog-content'>
                <p className='date'>1 Dec, 2023</p>
                <h5 className='title'>
                    Lorem ipsum dolor, sit amet consectetur.
                </h5>
                <p className='des'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec sodales nisi, vitae ultricies nisi.
                </p>
                <Link className='button blog-btn' to="">Read More</Link>
            </div>
        </>
    )
}

export default BlogCart