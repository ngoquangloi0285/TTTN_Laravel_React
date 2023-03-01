import React from 'react'
import { Link } from 'react-router-dom'

const BlogCart = () => {
    return (
        <>
            <div className='col-3'>
                <div className='blog-card'>
                    <img className='img-fluid' src='images/blog-1.jpg' alt='' />
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
                    <Link className='button' to="/">Read More</Link>
                </div>
            </div>
        </>
    )
}

export default BlogCart