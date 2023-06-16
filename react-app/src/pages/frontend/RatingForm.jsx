import React, { useState } from 'react';
import axios from 'axios';
import './ratingForm.css'
import { FaStar } from 'react-icons/fa';

const colors = {
    // orange: "#FFBA5A",
    color: 'rgb(255, 215, 0)',
    grey: "#a9a9a9"

};

const RatingForm = ({ productId }) => {

    const [currentValue, setCurrentValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(undefined);
    const stars = Array(5).fill(0)

    const handleClick = value => {
        setCurrentValue(value)
    }

    const handleMouseOver = newHoverValue => {
        setHoverValue(newHoverValue)
    };

    const handleMouseLeave = () => {
        setHoverValue(undefined)
    }

    return (
        <>
            <div style={styles.container}>
                <h2> Đánh giá của bạn </h2>
                <div style={styles.stars}>
                    {stars.map((_, index) => {
                        return (
                                <FaStar
                                    key={index}
                                    size={24}
                                    onClick={() => handleClick(index + 1)}
                                    onMouseOver={() => handleMouseOver(index + 1)}
                                    onMouseLeave={handleMouseLeave}
                                    color={(hoverValue || currentValue) > index ? colors.color : colors.grey}
                                    style={{
                                        marginRight: 10,
                                        cursor: "pointer"
                                    }}
                                />
                        )
                    })}
                </div>
                <textarea
                    placeholder="Đánh giá của bạn là gì?"
                    style={styles.textarea}
                />

                <button className='btn-rating'
                    style={styles.button}
                >
                    Đánh giá
                </button>

            </div>
        </>
    );

};
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    stars: {
        display: "flex",
        flexDirection: "row",
    },
    textarea: {
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        padding: 10,
        margin: "20px 0",
        minHeight: 100,
        width: 300
    },
    button: {
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        width: 300,
        padding: 10,
    }

};
export default RatingForm;
