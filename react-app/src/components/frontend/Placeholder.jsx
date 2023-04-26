import React from "react";
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

const ProductPlaceholder = () => {
    return (
        <>
            <div className="card" aria-hidden="true">
                <img
                    style={
                        {
                            height: '200px',
                        }
                    }
                    src="" className="card-img-top placeholder-glow placeholder" alt="" />
                <div className="card-body">
                    <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-8"></span>
                    </p>
                </div>
            </div>
            {/* <ReactPlaceholder
                        type="text"
                        showLoadingAnimation
                        rows={5}
                    /> */}
        </>
    );
};

export default ProductPlaceholder;
