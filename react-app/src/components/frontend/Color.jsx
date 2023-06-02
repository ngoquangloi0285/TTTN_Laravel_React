import React from 'react'
import { Link } from 'react-router-dom';

const Color = (props) => {
    const color = props.color;
    return (
        <>
            <ul className="colors">
                {
                    color.map((color) => (
                        <Link to={`../product/color/${color}`}>
                            <li style={{
                                backgroundColor: color
                            }}></li>
                        </Link>
                    ))
                }
            </ul>
        </>
    )
}

export default Color