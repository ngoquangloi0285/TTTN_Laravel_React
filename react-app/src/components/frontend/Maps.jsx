import React from 'react'
import { Link } from 'react-router-dom'

const Maps = (props) => {
    const { title } = props;
    return (
        <div className='maps py-4'>
            <div className="container-xxl">
                <div className="row">
                    <div className="col-12">
                        <p className='text-center mb-0'>
                            <Link to="/" >
                                Trang chủ &nbsp;
                            </Link>
                            / {title}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Maps