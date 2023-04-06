import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { IoCreateOutline } from 'react-icons/io5';
import NewProduct from './NewProduct';
import { ImCancelCircle } from 'react-icons/im';
import LoadingOverlay from 'react-loading-overlay';
import { AiOutlineClear } from 'react-icons/ai';
const EditProduct = () => {
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const [product, setProduct] = useState({});

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(`/api/product/v1/products/${encodedId}`);
                setProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        getProduct();
    }, [encodedId]);

    return (
        <>
            <div className='d-flex my-3 align-items-center justify-content-center'>
                <h1 className='text-white'>Edit product with ID: {encodedId}</h1>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-warning btn-edit mx-2 d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#editProduct" aria-expanded="false" aria-controls="collapseWidthExample">
                            <IoCreateOutline className='fs-4' /> Edit Product
                        </button>
                    </div>
                </div>
                <Link
                className='link-edit'
                to='../product'>Back Product</Link>
            </div>
            <div className='position-relative'>
                <div className="collapse edit-product position-absolute z-2" id="editProduct">
                    <div className="card card-body "
                        style={
                            {
                                minWidth: '1400px',
                                minHeight: '600px',
                            }
                        }>
                        <div className="p-2 text-dark">
                            <Edit />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const Edit = () => {
    return (
        <>
            <form action=""
            // onSubmit={handleSubmit}
            >
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                {/* <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label> */}
                            </div>
                        </div>
                        {/* {status && (
                            <div className="alert1 alert-success1 show1 text-center fs-4" role="alert">
                                {status}
                            </div>
                        )} */}
                        <div className='mb-2 text-center position-absolute cancel-edit'>
                            <button className="btn btn-success text-white mx-2" type="submit">
                                <IoCreateOutline className='fs-4' />
                                Update Product
                            </button>
                            <button className="btn text-white mx-2" type="button" data-bs-toggle="collapse" data-bs-target="#editProduct" aria-expanded="false" aria-controls="collapseWidthExample">
                                <ImCancelCircle className='fs-4' />
                                Cancel
                            </button>
                        </div>
                        <LoadingOverlay className='text-danger'
                            spinner
                            // active={isLoading}
                            text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
                            }
                        ></LoadingOverlay>
                    </div>
                    <div className="col-3">
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="nameproduct">Name Product:</label>
                            <input
                                // value={nameProduct}
                                // onChange={(e) => setNameProduct(e.target.value)}
                                className='form-control' id='nameProduct' type="text" placeholder='Enter Product Name' />
                            {/* {errors.nameProduct && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.nameProduct}
                                </div>
                            )} */}
                        </div>

                        <label className='form-label fw-bold' htmlFor="category">Category Product:</label>
                        {/* {showCategoryToast && (
                            <Toast bg="warning" delay={5000} autohide onClose={() => setShowCategoryToast(false)}>
                                <Toast.Body className='text-danger fw-bold fs-6'>Category has no data</Toast.Body>
                            </Toast>
                        )} */}
                        <select className="form-select mb-2" id='category' aria-label="Default select example">
                            <option value="" selected>Select Category</option>
                            {/* {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name_category}</option>
                            ))} */}
                        </select>
                        {/* {errors.category && (
                            <div className="alert alert-danger" role="alert">
                                {errors.category}
                            </div>
                        )} */}

                        <label className='form-label fw-bold' htmlFor="brand">Brand Product:</label>
                        {/* {showBrandToast && (
                            <Toast bg="warning" delay={5000} autohide onClose={() => setShowBrandToast(false)}>
                                <Toast.Body className='text-danger fw-bold fs-6'>Brand has no data</Toast.Body>
                            </Toast>
                        )} */}
                        <select className="form-select mb-2" id="brand" aria-label="Default select example">
                            <option value="" selected>Select Brand</option>
                            {/* {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))} */}
                        </select>
                        {/* {errors.brand && (
                            <div className="alert alert-danger" role="alert">
                                {errors.brand}
                            </div>
                        )} */}

                        <label className='form-label fw-bold' htmlFor="summary">Summary:</label>
                        <div className="form-floating mb-2">
                            <textarea className="form-control"
                                // value={summary}
                                // onChange={(e) => setSummary(e.target.value)}
                                placeholder="Leave a comment here" id="summary"></textarea>
                            <label for="summary">Summary:</label>
                            {/* {errors.summary && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.summary}
                                </div>
                            )} */}
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="row">
                            <div className="col-4">
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="costProduct">Cost (giá góc):</label>
                                    <input className='form-control'
                                        // value={costProduct}
                                        // onChange={(e) => setCostProduct(e.target.value)}
                                        id='costProduct' type="text" placeholder='Enter cost' />
                                    {/* {errors.costProduct && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.costProduct}
                                        </div>
                                    )} */}
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="priceSale">Price (giá bán):</label>
                                    <input className='form-control'
                                        // value={priceSale}
                                        // onChange={(e) => setPriceSale(e.target.value)}
                                        id='priceSale' type="text" placeholder='Enter price' />
                                    {/* {errors.priceSale && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.priceSale}
                                        </div>
                                    )} */}
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="discount">Discount(%):</label>
                                    <input className='form-control'
                                        // value={discount}
                                        // onChange={(e) => setDiscount(e.target.value)}
                                        id='discount' maxLength={2} type="text" placeholder='Enter discount %' />
                                    {/* {errors.discount && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.discount}
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                        <label className='form-label fw-bold' htmlFor="floatingTextarea">Options:</label>
                        <div className="row">
                            <div className="col-4">
                                <label className='form-label fw-bold' htmlFor="color">Color:</label>
                                <input className='form-control'
                                    // value={color}
                                    // onChange={(e) => setColor(e.target.value)}
                                    id='color' type="text" placeholder='Enter color' />
                                {/* {errors.color && (
                                    <div className="alert alert-danger"
                                        style={
                                            { fontSize: '14px' }
                                        }
                                        role="alert">
                                        {errors.color}
                                    </div>
                                )} */}
                            </div>
                            <div className="col-4">
                                <label className='form-label fw-bold' htmlFor="inch">Inch:</label>
                                <input className='form-control'
                                    // value={inch}
                                    // onChange={(e) => setInch(e.target.value)}
                                    id='inch' type="text" placeholder='Enter inch' />
                                {/* {errors.inch && (
                                    <div className="alert alert-danger"
                                        style={
                                            { fontSize: '14px' }
                                        }
                                        role="alert">
                                        {errors.inch}
                                    </div>
                                )} */}
                            </div>
                            <div className="row my-3">
                                <div className="col-6">
                                    <div className="mb-2">
                                        <label className='form-label fw-bold' htmlFor="startTime">Start Time:</label>
                                        <input
                                            className='form-control'
                                            // value={startTime}
                                            // onChange={(e) => setStartTime(e.target.value)}
                                            id='startTime'
                                            type="datetime-local"
                                        />
                                        {/* {errors.startTime && (
                                            <div
                                                className="alert alert-danger"
                                                style={{
                                                    fontSize: '14px'
                                                }}
                                                role="alert"
                                            >
                                                {errors.startTime}
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-2">
                                        <label className='form-label fw-bold' htmlFor="endTime">End Time:</label>
                                        <input
                                            className='form-control'
                                            // value={endTime}
                                            // onChange={(e) => setEndTime(e.target.value)}
                                            id='endTime'
                                            type="datetime-local"
                                        />
                                        {/* {errors.endTime && (
                                            <div
                                                className="alert alert-danger"
                                                style={{
                                                    fontSize: '14px'
                                                }}
                                                role="alert"
                                            >
                                                {errors.endTime}
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className='form-label fw-bold' htmlFor="detail">Detail:</label>
                        {/* {errors.content && (
                            <div className="alert alert-danger"
                                style={
                                    { fontSize: '14px' }
                                }
                                role="alert">
                                {errors.content}
                            </div>
                        )} */}
                        <div className="form-floating mb-2">
                            <div className="" >
                                {/* <ReactQuill value={content} onChange={handleContentChange} /> */}

                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <label className='form-label fw-bold' htmlFor="detail">Upload Image:</label>
                        <input className='form-control' name='file[]' id='file' type="file" multiple
                        // onChange={handleUpload} 
                        />
                        {/* {errors.files && (
                            <div className="alert alert-danger"
                                style={
                                    { fontSize: '14px' }
                                }
                                role="alert">
                                {errors.files}
                            </div>
                        )} */}
                        <div className="row">
                            {/* {renderPreview()} */}

                        </div>
                        <br />
                        {/* {
                            files.length > 0 &&
                            <div className="col-6">
                                <button className="btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUpPhotos}>
                                    <AiOutlineClear className='fs-4' />
                                    Clean up photos
                                </button>
                            </div>
                        } */}
                        <br />
                        <label className='form-label fw-bold' htmlFor="status">Status:</label>
                        <select className="form-select mb-2" id="status" aria-label="Default select example">
                            <option value="" selected>Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {/* {errors.status && (
                            <div className="alert alert-danger"
                                style={
                                    { fontSize: '14px' }
                                }
                                role="alert">
                                {errors.status}
                            </div>
                        )} */}
                        <br />
                        <div className="row mt-5">
                            <div className="col-6">
                                <button className="btn btn-danger d-flex text-white mx-2" type="button"
                                // onClick={ClearUp}
                                >
                                    <AiOutlineClear className='fs-4' />
                                    Clear up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </>
    )
}



export default EditProduct