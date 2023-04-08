import React from 'react'
import { Link } from 'react-router-dom'

const Suggestions = () => {
    return (
        <div className="col-3">
            <div className="famous-card shadow position-relative">
                <Link>
                    <img style={
                        {
                            "border-bottom": "3px solid #000000"
                        }
                    }
                        className="img-fluid" src="images/tab.jpg" alt="" />
                </Link>
                <div className="famous-content shadow d-flex flex-column position-absolute">
                    <h5>Big Screen</h5>
                    <h6>Smart Watch Series 7</h6>
                    <p>From $399or $16.62/mo. for 24 mo.*</p>
                    <strong>
                        Welcome to visit !
                    </strong>
                </div>
            </div>
        </div>
    )
}

export default Suggestions