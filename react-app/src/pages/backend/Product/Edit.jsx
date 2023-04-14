import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { IoCreateOutline } from 'react-icons/io5';
import { ImCancelCircle } from 'react-icons/im';
import LoadingOverlay from 'react-loading-overlay';
import { AiOutlineClear } from 'react-icons/ai';
import moment from 'moment-timezone';
import useAuthContext from '../../../context/AuthContext';
import { Toast } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Meta from '../../../components/frontend/Meta';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert2';

export default function Edit(props) {

    const { user } = useAuthContext();
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const navigate = useNavigate();
    const [showCategoryToast, setShowCategoryToast] = useState(false);
    const [showBrandToast, setShowBrandToast] = useState(false);
    const [errors, setError] = useState([]);
    const [status, setStatus] = useState(null);

    // lay thoi hien tai
    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 16);

    const [product, setProduct] = useState({
        name_product: '',
        category_id: '',
        brand_id: '',
        summary: '',
        cost: '',
        price: '',
        discount: '',
        color: '',
        inch: '',
        start_time: currentDateTime,
        end_time: currentDateTime,
        detail: '',
        status: '',
    })
    const handleInput = (e) => {
        e.persist()
        setProduct({ ...product, [e.target.name]: e.target.value })
    }


    const [categoriesList, setCategoriesList] = useState([]);

    //   tìm id category trùng với id trong bảng category
    const category = categoriesList.find(c => c.category_id === product.category_id);
    // khi trùng id thì lấy name_category ra
    const categoryName = category ? category.name_category : '';

    const [brands, setBrands] = useState([]);
    //   tìm id brands trùng với id trong bảng category
    const brand = brands.find(c => c.brand_id === product.brand_id);
    // khi trùng id thì lấy name_brands ra
    const brandName = brand ? brand.name : '';

    const [arrTimeArr, setStartTimeArr] = useState([]);
    const start_end_time = arrTimeArr.find(c => c.product_id === product.id);
    // const getStart_Time = start_end_time ? new Date(start_end_time.start_time).toISOString().slice(0, 16) : '';
    // const getEnd_Time = start_end_time ? new Date(start_end_time.end_time).toISOString().slice(0, 16) : '';
    const getStart_Time = start_end_time ? start_end_time.start_time : '';
    const getEnd_Time = start_end_time ? start_end_time.end_time : '';
    const [files, setFiles] = useState([]);

    // const [pictures, setPictures] = useState([]);

    // const handlePictures = (e) => {
    //     const files = e.target.files;
    //     setPictures(files)
    // }

    const [previewUrls, setPreviewUrls] = useState([]);
    const handleUpload = (event) => {
        event.preventDefault();
        const fileList = event.target.files[0];
        const newFiles = Array.from(fileList);
        const shouldAddFiles = newFiles.filter(file => !files.some(f => f.name === file.name));
        setFiles([...files, ...shouldAddFiles]);
        console.log(shouldAddFiles)
        const newPreviewUrls = shouldAddFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    };
    const renderPreview = () => {
        return previewUrls.map((url) => {
            return (
                <div className='col-4' key={url}>
                    <img className='img-thumbnail' src={url} alt='Preview' />
                </div>
            );
        });
    };

    const [arrImages, setArrImages] = useState([]);
    const images = arrImages.filter(c => c.product_id === product.product_id);
    const image_0 = product;
    images.unshift(image_0);

    const clearImageUrls = () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        setFiles([]);
    };

    const ClearUpPhotos = () => {
        document.getElementById("file").value = "";
        clearImageUrls();
    };

    const ClearUp = (e) => {
        ClearUpPhotos();
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productRes, categoryRes, brandRes, countdownRes, imagesRes] = await Promise.all([
                    axios.get(`/api/product/v1/edit/${encodedId}`),
                    axios.get('/api/category/v1/category'),
                    axios.get('/api/category/v1/brands'),
                    axios.get('/api/countdown/v1/countdown'),
                    axios.get('/api/images/v1/images'),
                ]);

                if (productRes.data.status === 200) {
                    setProduct(productRes.data.product)
                } else if (productRes.data.status === 404) {
                    swal({
                        title: 'Error',
                        text: productRes.data.message,
                        icon: 'error'
                    });
                }

                if (categoryRes.data.length === 0) {
                    setShowCategoryToast(true);
                    setTimeout(() => setShowCategoryToast(false), 10000);
                }
                setCategoriesList(categoryRes.data);

                if (brandRes.data.length === 0) {
                    setShowBrandToast(true);
                    setTimeout(() => setShowBrandToast(false), 10000);
                }
                setBrands(brandRes.data);

                if (countdownRes.data) {
                    setStartTimeArr(countdownRes.data);
                }

                if (imagesRes.data) {
                    setArrImages(imagesRes.data);
                }
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [encodedId]);

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nameProduct', product.name_product);
        formData.append('category', product.category_id);
        formData.append('brand', product.brand_id);
        formData.append('summary', product.summary);
        formData.append('costProduct', product.cost);
        formData.append('priceSale', product.price);
        formData.append('discount', product.discount);
        formData.append('color', product.color);
        formData.append('inch', product.inch);
        formData.append('start_time', product.start_time);
        formData.append('end_time', product.end_time);
        formData.append('detail', product.detail);
        formData.append('status', product.status);

        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }
        console.log(formData)
    }


    return (
        <>
            <Meta title={"Edit Product"} />
            <form action=""
                onSubmit={handleUpdate}
            >
                <ToastContainer />
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label>
                            </div>
                        </div>

                        <div className='mb-2 text-center position-absolute cancel'>
                            <button className="btn btn-success text-white mx-2" type="submit">
                                <IoCreateOutline className='fs-4' />
                                Update Product
                            </button>
                            <Link to="../product" className="btn text-white mx-2" type="button">
                                <ImCancelCircle className='fs-4' />
                                To back product
                            </Link>
                        </div>
                        <LoadingOverlay className='text-danger'
                            spinner
                            active={isLoading}
                            text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
                            }
                        ></LoadingOverlay>
                    </div>
                    <div className="col-3">
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="nameproduct">Name Product:</label>
                            <input
                                value={product.name_product}
                                onChange={handleInput}
                                className='form-control text-edit' id='nameProduct' type="text" placeholder='Enter Product Name' />
                            {errors.nameProduct && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.nameProduct}
                                </div>
                            )}
                        </div>

                        <label className='form-label fw-bold' htmlFor="category">Category Product:</label>
                        {showCategoryToast && (
                            <Toast bg="warning" delay={5000} autohide onClose={() => setShowCategoryToast(false)}>
                                <Toast.Body className='text-danger fw-bold fs-6'>Category has no data</Toast.Body>
                            </Toast>
                        )}
                        <select className="form-select mb-2" value={product.category_id} onChange={handleInput} id='category' aria-label="Default select example">
                            <option value={category ? category.category_id : ""} selected>
                                {categoryName ? `Selected: ${categoryName}` : 'Select category'}
                            </option>
                            {categoriesList.map(category => (
                                <option className='' key={category.id} value={category.category_id}>{category.name_category}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <div className="alert alert-danger" role="alert">
                                {errors.category}
                            </div>
                        )}

                        <label className='form-label fw-bold' htmlFor="brand">Brand Product:</label>
                        {showBrandToast && (
                            <Toast bg="warning" delay={5000} autohide onClose={() => setShowBrandToast(false)}>
                                <Toast.Body className='text-danger fw-bold fs-6'>Brand has no data</Toast.Body>
                            </Toast>
                        )}
                        <select className="form-select mb-2" id="brand" aria-label="Default select example">
                            <option value={brand ? brand.brand_id : ""} selected>
                                {brandName ? `Selected: ${brandName}` : 'Select Brand'}
                            </option>
                            {brands.map(brand => (
                                <option className='' key={brand.id} value={brand.brand_id}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.brand && (
                            <div className="alert alert-danger" role="alert">
                                {errors.brand}
                            </div>
                        )}

                        <label className='form-label fw-bold' htmlFor="summary">Summary:</label>
                        <div className="form-floating mb-2">
                            <textarea className="form-control"
                                value={product.summary}
                                onChange={handleInput}
                                placeholder="Leave a comment here" id="summary"></textarea>
                            <label for="summary">Summary:</label>
                            {errors.summary && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.summary}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="row">
                            <div className="col-4">
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="costProduct">Cost (giá góc):</label>
                                    <input className='form-control'
                                        value={product.cost}
                                        onChange={handleInput}
                                        id='costProduct' type="text" placeholder='Enter cost' />
                                    {errors.costProduct && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.costProduct}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="priceSale">Price (giá bán):</label>
                                    <input className='form-control'
                                        value={product.price}
                                        onChange={handleInput}
                                        id='priceSale' type="text" placeholder='Enter price' />
                                    {errors.priceSale && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.priceSale}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="discount">Discount(%):</label>
                                    <input className='form-control'
                                        value={product.discount}
                                        onChange={handleInput}
                                        id='discount' maxLength={2} type="text" placeholder='Enter discount %' />
                                    {errors.discount && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.discount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <label className='form-label fw-bold' htmlFor="floatingTextarea">Options:</label>
                        <div className="row">
                            <div className="col-4">
                                <label className='form-label fw-bold' htmlFor="color">Color:</label>
                                <input className='form-control'
                                    value={product.color}
                                    onChange={handleInput}
                                    id='color' type="text" placeholder='Enter color' />
                                {errors.color && (
                                    <div className="alert alert-danger"
                                        style={
                                            { fontSize: '14px' }
                                        }
                                        role="alert">
                                        {errors.color}
                                    </div>
                                )}
                            </div>
                            <div className="col-4">
                                <label className='form-label fw-bold' htmlFor="inch">Inch:</label>
                                <input className='form-control'
                                    value={product.inch}
                                    onChange={handleInput}
                                    id='inch' type="text" placeholder='Enter inch' />
                                {errors.inch && (
                                    <div className="alert alert-danger"
                                        style={
                                            { fontSize: '14px' }
                                        }
                                        role="alert">
                                        {errors.inch}
                                    </div>
                                )}
                            </div>
                            <div className="row my-3">
                                <div className="col-6">
                                    <div className="mb-2">
                                        <label className='form-label fw-bold' htmlFor="startTime">Start Time:</label>
                                        <p className='m-0'>selected end time: </p>
                                        <strong>{getStart_Time}</strong>
                                        <input
                                            className='form-control mt-2'
                                            value={product.start_time}
                                            name='start_time'
                                            onChange={handleInput}
                                            id='startTime'
                                            type="datetime-local"
                                            min="1970-01-01T00:00" // thời điểm tối thiểu có thể chọn
                                            max="9999-12-31T23:59" // thời điểm tối đa có thể chọn
                                        />
                                        {errors.startTime && (
                                            <div
                                                className="alert alert-danger"
                                                style={{
                                                    fontSize: '14px'
                                                }}
                                                role="alert"
                                            >
                                                {errors.startTime}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-2">
                                        <label className='form-label fw-bold' htmlFor="endTime">End Time:</label>
                                        <p className='m-0'>selected end time: </p>
                                        <strong>{getEnd_Time}</strong>
                                        <input
                                            className='form-control mt-2'
                                            value={product.end_time}
                                            onChange={handleInput}
                                            id='endTime'
                                            name='end_time'
                                            type="datetime-local"
                                            min="1970-01-01T00:00" // thời điểm tối thiểu có thể chọn
                                            max="9999-12-31T23:59" // thời điểm tối đa có thể chọn
                                            defaultValue={currentDateTime}
                                        />
                                        {errors.endTime && (
                                            <div
                                                className="alert alert-danger"
                                                style={{
                                                    fontSize: '14px'
                                                }}
                                                role="alert"
                                            >
                                                {errors.endTime}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className='form-label fw-bold' htmlFor="detail">Detail:</label>
                        {errors.content && (
                            <div className="alert alert-danger"
                                style={
                                    { fontSize: '14px' }
                                }
                                role="alert">
                                {errors.content}
                            </div>
                        )}
                        <div className="form-floating mb-2">
                            <div className="" >
                                <ReactQuill value={product.detail} onChange={handleInput} />
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <label className='form-label fw-bold' htmlFor="detail">Upload Image:</label>
                        <input className='form-control' name='file[]' id='file' type="file" multiple onChange={handleUpload} />
                        {errors.files && (
                            <div className="alert alert-danger"
                                style={
                                    { fontSize: '14px' }
                                }
                                role="alert">
                                {errors.files}
                            </div>
                        )}
                        <div className="row">
                            {renderPreview()}
                        </div>
                        <br />
                        {
                            files.length > 0 &&
                            <div className="col-6">
                                <button className="btn btn-danger d-flex text-white mx-2" type="button"
                                    onClick={ClearUpPhotos}
                                >
                                    <AiOutlineClear className='fs-4' />
                                    Clean up photos
                                </button>
                            </div>
                        }
                        {
                            images === null ? "" :
                                <div style={{ width: '100%' }}>
                                    <h4 className='mt-3'>Images selected: </h4>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {images.map((image, index) => (
                                            <img className='img img-fluid img-thumbnail'
                                                key={index}
                                                style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }}
                                                src={`http://localhost:8000/storage/images/${image.image}`}
                                                alt={image.image}
                                            />
                                        ))}
                                    </div>
                                </div>
                        }
                        <br />
                        <label className='form-label fw-bold' htmlFor="status">Status:</label>
                        <select className="form-select mb-2" value={product.status} onChange={handleInput} id="status" aria-label="Default select example">
                            <option value="" selected>Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                            <div className="alert alert-danger"
                                style={
                                    { fontSize: '14px' }
                                }
                                role="alert">
                                {errors.status}
                            </div>
                        )}
                        <br />
                        <button className="btn btn-danger d-flex text-white mx-2" type="button"
                            onClick={ClearUp}
                        >
                            <AiOutlineClear className='fs-4' />
                            Back to the original
                        </button>
                    </div>
                </div>
            </form>

        </>
    )
}
