import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { Toast, Container } from 'react-bootstrap';
import moment from 'moment-timezone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAuthContext from '../../../context/AuthContext';
import LoadingOverlay from 'react-loading-overlay';
import { ImCancelCircle } from 'react-icons/im';
import { IoCreateOutline } from 'react-icons/io5';
import { AiOutlineClear, AiOutlineRollback } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Edit = () => {
    const { user } = useAuthContext();
    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);
    const navigate = useNavigate();

    // theo dõi và truyền dữ liệu cho category và brand
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [nameProduct, setNameProduct] = useState();
    const [getCategory, setGetCategory] = useState();
    const [summary, setSummary] = useState();
    const [costProduct, setCostProduct] = useState();
    const [priceSale, setPriceSale] = useState();
    const [discount, setDiscount] = useState();
    const [color, setColor] = useState();
    const [inch, setInch] = useState();
    const [type, setType] = useState();
    const [total, setTotal] = useState();


    const timeZone = 'America/New_York';
    const now = moment().tz(timeZone).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');

    const [startTime, setStartTime] = useState(now.slice(0, 16));
    const [endTime, setEndTime] = useState(now.slice(0, 16));
    const [arrTimeArr, setStartTimeArr] = useState([]);

    const [content, setContent] = useState('');

    // kiểm tra category và brand có dữ liệu không
    const [showCategoryToast, setShowCategoryToast] = useState(false);
    const [showBrandToast, setShowBrandToast] = useState(false);

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState([]);

    const [status, setStatus] = useState(null);

    const checkImage = (file, options) => {
        const { maxSize, acceptedFormats } = options;

        // Kiểm tra định dạng ảnh
        const format = file.type.split('/')[1];
        if (!acceptedFormats.includes(format)) {
            return {
                isValid: false,
                message: `Định dạng ảnh không hợp lệ. Vui lòng chọn các định dạng: ${acceptedFormats.join(', ')}.`
            };
        }

        // Kiểm tra kích thước ảnh
        if (file.size > maxSize) {
            const maxSizeInMb = maxSize / (1024 * 1024);
            return {
                isValid: false,
                message: `Kích thước ảnh vượt quá giới hạn cho phép (${maxSizeInMb} MB). Vui lòng chọn một ảnh có kích thước nhỏ hơn.`
            };
        }

        return { isValid: true };
    };

    const handleUpload = (event) => {
        event.preventDefault();
        const fileList = event.target.files;
        const newFiles = Array.from(fileList);
        const shouldAddFiles = newFiles.filter(file => !files.some(f => f.name === file.name));

        // Kiểm tra tệp ảnh trước khi thêm vào danh sách
        const options = { maxSize: 5 * 1024 * 1024, acceptedFormats: ['jpeg', 'jpg', 'png'] };
        const invalidFiles = shouldAddFiles.filter(file => !checkImage(file, options).isValid);
        if (invalidFiles.length > 0) {
            // Hiển thị thông báo lỗi
            const message = invalidFiles.map(file => checkImage(file, options).message).join('\n');
            alert(message);
            return;
        }

        // Thêm các tệp hợp lệ vào danh sách và tạo URL đối tượng của chúng
        setFiles([...files, ...shouldAddFiles]);
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

    const clearImageUrls = useCallback(() => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        setFiles([]);
    }, [previewUrls]);

    const ClearUpPhotos = () => {
        document.getElementById("file").value = "";
        clearImageUrls();
    };

    const ClearUp = useCallback((e) => {
        // document.getElementById("category").value = "";
        // document.getElementById("brand").value = "";
        setNameProduct("");
        setSummary("");
        setCostProduct("");
        setPriceSale("");
        setDiscount("");
        setColor("");
        setInch("");
        setStartTime(now.slice(0, 16))
        setEndTime(now.slice(0, 16))
        setContent("");
        document.getElementById("file").value = "";
        document.getElementById("status").value = "";
        clearImageUrls();
    }, [clearImageUrls, now])

    const handleContentChange = (value) => {
        setContent(value);
        if (files.length) {
            console.log(files)
        }
    };

    // lay du lieu tu product va product images
    const [product, setProduct] = useState([]);
    const [arrImages, setArrImages] = useState([]);
    useEffect(() => {
        Promise.all([
            axios.get(`api/product/v1/edit/${encodedId}`),
            axios.get('api/category/v1/category'),
            axios.get('api/brand/v1/brand'),
            axios.get('api/images/v1/images'),
            axios.get('api/countdown/v1/countdown'),
        ])
            .then(([productResponse, categoryResponse, brandResponse, imagesResponse, countdownRes]) => {
                if (productResponse.data) {
                    setProduct(productResponse.data);
                }
                if (categoryResponse.data.length === 0) {
                    setShowCategoryToast(true);
                    setTimeout(() => setShowCategoryToast(false), 10000);
                } else {
                    setCategories(categoryResponse.data);
                }
                if (categoryResponse.data.status === 200) {
                    setGetCategory(categoryResponse.data);
                }

                if (brandResponse.data.length === 0) {
                    setShowBrandToast(true);
                    setTimeout(() => setShowBrandToast(false), 10000);
                } else {
                    setBrands(brandResponse.data);
                }
                if (productResponse.data) {
                    setNameProduct(productResponse.data.product.name_product);
                    setSummary(productResponse.data.product.summary);
                    setCostProduct(productResponse.data.product.cost);
                    setPriceSale(productResponse.data.product.price);
                    setDiscount(productResponse.data.product.discount);
                    setColor(productResponse.data.product.color);
                    setInch(productResponse.data.product.inch);
                    // setTotal(productResponse.data.product.total);
                    setType(productResponse.data.product.type);
                    setContent(productResponse.data.product.detail);
                }
                if (imagesResponse.data) {
                    setArrImages(imagesResponse.data)
                }
                if (countdownRes.data) {
                    setStartTimeArr(countdownRes.data);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            });
    }, [encodedId]);

    // tìm images
    const images = arrImages.filter(c => c.product_id === product.product.id);
    const image_0 = product.product
    images.unshift(image_0);
    console.log(image_0)
    //   tìm id category trùng với id trong bảng category
    const category = categories.find(c => c.id === product.product.category_id);
    // khi trùng id thì lấy name_category ra
    const categoryName = category ? category.name_category : '';
    //   tìm id brands trùng với id trong bảng category
    const brand = brands.find(c => c.id === product.product.brand_id);
    // khi trùng id thì lấy name_brands ra
    const brandName = brand ? brand.name : '';
    // in star time và end time 
    const start_end_time = arrTimeArr.find(c => c.product_id === product.product.id);
    const getStart_Time = start_end_time ? start_end_time.start_time : '';
    const getEnd_Time = start_end_time ? start_end_time.end_time : '';


    const [statusType, setStatusType] = useState('new_product');
    // const [discount, setDiscount] = useState('');

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscount(value);
        console.log(value);
        // Nếu có giá trị discount, chuyển select sang giá trị 'product_sale'
        if (value === "0") {
            setStatusType('new_product');
        } else {
            setStatusType('product_sale');
        }
    };

    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = useCallback(async () => {
        const btn = document.getElementById('btn_create');

        // lấy dữ liệu thì form
        const category = document.getElementById("category").value;
        const brand = document.getElementById("brand").value;
        const status = document.getElementById("status").value;
        const type = document.getElementById("type").value;

        // định nghĩa lỗi
        const newErrors = {};
        if (!nameProduct) {
            newErrors.nameProduct = "Vui lòng nhập tên sản phẩm.";
        }
        if (!category) {
            newErrors.category = "Vui lòng chọn danh mục.";
        }
        if (!brand) {
            newErrors.brand = "Vui lòng chọn nhãn hiệu.";
        }
        if (!summary) {
            newErrors.summary = "Vui lòng nhập bản tóm tắt.";
        }
        if (!costProduct) {
            newErrors.costProduct = "Vui lòng nhập giá góc.";
        }
        if (isNaN(costProduct)) {
            newErrors.costProduct = "Giá gốc phải là số.";
        }
        if (!priceSale) {
            newErrors.priceSale = "Vui lòng nhập giá bán.";
        }
        if (isNaN(priceSale)) {
            newErrors.priceSale = "Giá bán phải là số.";
        }
        if (discount) {
            if (isNaN(discount)) {
                newErrors.discount = "Giảm giá phải là số.";
            } else if (discount <= 0) {
                newErrors.discount = "Giảm giá phải lớn hơn 0.";
            } else if (discount > 100) {
                newErrors.discount = "Giảm giá phải nhỏ hơn hoặc bằng 100.";
            }
        }
        if (!color) {
            newErrors.color = "Vui lòng nhập màu.";
        }
        if (!inch) {
            newErrors.inch = "Vui lòng số icnh.";
        }
        if (isNaN(inch)) {
            newErrors.inch = "Inch phải là số.";
        }

        const nowDate = moment().tz(moment.tz.guess());
        const startDate = moment(startTime + ':00.000Z').tz(moment.tz.guess());
        const endDate = moment(endTime + ':00.000Z').tz(moment.tz.guess());

        if (startDate < nowDate.startOf('day')) {
            newErrors.startTime = 'Start time phải là ngày hiện tại hoặc sau ngày hiện tại.';
        }
        if (endDate <= nowDate) {
            newErrors.endTime = 'End time không được nhỏ hơn ngày hiện tại.';
        } else if (endDate.diff(startDate, 'days') > 30) {
            newErrors.endTime = 'End time không được quá 1 tháng so với start time.';
        } else if (endDate <= startDate) {
            newErrors.endTime = 'End time không được nhỏ hơn hoặc bằng Start time.';
        } else if (endDate.isSame(startDate)) {
            newErrors.endTime = 'End time không được bằng với start time.';
        }
        if (!content) {
            newErrors.content = "Vui lòng nhập chi tiết sản phẩm.";
        }
        if (files.length === 0) {
            newErrors.files = "Vui lòng chọn hình ảnh.";
        }
        if (!status) {
            newErrors.status = "Vui lòng chọn trạng thái.";
        }

        // Kiểm tra các giá trị khác và thêm thông báo lỗi tương ứng vào object `newErrors`
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }
        // chèn dữ liệu
        const formData = new FormData();
        formData.append('nameProduct', nameProduct);
        formData.append('category', category);
        formData.append('brand', brand);
        formData.append('summary', summary);
        formData.append('costProduct', costProduct);
        formData.append('priceSale', priceSale);
        formData.append('discount', discount ? discount : '');
        formData.append('color', color);
        formData.append('inch', inch);
        formData.append('type', type);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('detail', content);
        formData.append('status', status);
        // quét files images
        files.forEach(file => formData.append('images[]', file));
        console.log(formData)
        try {
            btn.innerHTML = "Updating...";
            const response = await axios.post(`/api/product/v1/update-product/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            btn.innerHTML = "Update Product";
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.status,
                    confirmButtonText: 'Back to Product'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('../product')
                    }
                });
            }
            // ClearUp();
        } catch (error) {
            setIsLoading(false);
            setIsLoading(false);
            // Nếu xảy ra lỗi, hiển thị thông báo lỗi
            if (error.response.status === 500) {
                Swal.fire('Error!', error.response.data.error, 'error');
            } else {
                Swal.fire('Error!', 'Failed to create new Product.', 'error');
            }
            btn.innerHTML = "Update Product";
        }
    }, [content, color, costProduct, discount, encodedId, endTime, files, inch, nameProduct, priceSale, startTime, summary, navigate]);
    // xác nhận  update
    const confirmUpdate = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to update Product this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit();
            }
        });
    }, [handleSubmit]);

    useEffect(() => {
        if (status || error) {
            setTimeout(() => {
                setStatus(null);
                setError(null);
            }, 5000);
        }
    }, [status, error]);

    if (isLoading === true) {
        return <LoadingOverlay className='text-danger'
            spinner
            active={isLoading}
            text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
            }
        ></LoadingOverlay>
    }
    return (
        <>
            <Meta title={`Update Product with ID: ${encodedId}`} />
            <div className="row">
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label>
                            </div>
                        </div>
                        <button onClick={confirmUpdate} className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                            <IoCreateOutline className='fs-4' />
                            Update product: <strong className='text-dark'>{id}</strong>
                        </button>
                        <Link to="../product" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            Back Product
                        </Link>

                    </div>
                    <div className="col-3">
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="nameProduct">Name Product:</label>
                            <input
                                value={nameProduct}
                                onChange={(e) => setNameProduct(e.target.value)}
                                className='form-control' id='nameProduct' type="text" placeholder='Enter Product Name' />
                            {errors.nameProduct && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.nameProduct}
                                </div>
                            )}
                        </div>

                        <label className='form-label fw-bold' htmlFor="category">Category Product:</label>
                        {showCategoryToast && (
                            <Toast bg="warning" delay={5000} autohide onClose={() => setShowCategoryToast(false)} style={{ width: "100%", height: "50px" }}>
                                <Toast.Body className='my-toast fw-bold fs-6'>Category has no data</Toast.Body>
                            </Toast>
                        )}
                        <select className="form-select mb-2" id='category' aria-label="Default select example">
                            <option value={category ? category.id : ""} selected>
                                {categoryName ? `Selected: ${categoryName}` : 'Select category'}
                            </option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name_category}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <div className="alert alert-danger" role="alert">
                                {errors.category}
                            </div>
                        )}

                        <label className='form-label fw-bold' htmlFor="brand">Brand Product:</label>
                        {showBrandToast && (
                            <Toast bg="warning" delay={5000} autohide onClose={() => setShowBrandToast(false)} style={{ width: "100%", height: "50px" }}>
                                <Toast.Body className='my-toast fw-bold fs-6'>Brand has no data</Toast.Body>
                            </Toast>
                        )}

                        <select className="form-select mb-2" id="brand" aria-label="Default select example">
                            <option value={brand ? brand.id : ""} selected>
                                {brandName ? `Selected: ${brandName}` : 'Select Brand'}
                            </option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
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
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
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
                                        value={costProduct}
                                        onChange={(e) => setCostProduct(e.target.value)}
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
                                        value={priceSale}
                                        onChange={(e) => setPriceSale(e.target.value)}
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
                                        value={discount}
                                        // onChange={(e) => setDiscount(e.target.value)}
                                        onChange={handleDiscountChange}
                                        id='discount' maxLength={3} type="text" placeholder='Enter discount %' />
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
                        <div className="row">
                            <div className="col-4">
                                <label className='form-label fw-bold' htmlFor="color">Color:</label>
                                <input className='form-control'
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
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
                                    value={inch}
                                    onChange={(e) => setInch(e.target.value)}
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
                            <div className="row my-2">
                                <div className="col-6">
                                    <div className="mb-2">
                                        <label className='form-label fw-bold' htmlFor="startTime">Start Time:</label>
                                        <input
                                            className='form-control'
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            id='startTime'
                                            type="datetime-local"
                                        />
                                        <p className='m-0'>selected start time: </p>
                                        <strong>
                                            {
                                                getStart_Time ? getStart_Time : ""
                                            }
                                        </strong>
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
                                        <input
                                            className='form-control'
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            id='endTime'
                                            type="datetime-local"
                                        />
                                        <p className='m-0'>selected end time: </p>
                                        <strong>
                                            {
                                                getEnd_Time ? getEnd_Time : ""
                                            }
                                        </strong>
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
                            <div>
                                <ReactQuill value={content} onChange={handleContentChange} />
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
                                <button className="btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUpPhotos}>
                                    <AiOutlineClear className='fs-4' />
                                    Clean up photos
                                </button>
                            </div>
                        }
                        <br />
                        {
                            images === null ? "Không có ảnh" :
                                <div style={{ width: '100%' }}>
                                    <h4 className='mt-3'>Images selected: </h4>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {images.map((image, index) => (
                                            <img className='img img-fluid img-thumbnail'
                                                key={index}
                                                style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }}
                                                src={`http://localhost:8000/storage/product/${image.image}`}
                                                alt={image.image}
                                            />
                                        ))}
                                    </div>
                                </div>
                        }
                        <br />
                        <label className='form-label fw-bold' htmlFor="status">Type:</label>
                        <p className='bg-info text-white p-2'>Selected Type: {type}</p>
                        <select className="form-select mb-2" id="type" aria-label="Default select example"
                            value={statusType}
                            onChange={(e) => setStatusType(e.target.value)}
                        >
                            <option value="new_product" selected>New Product</option>
                            <option value="product_sale">Sale Product</option>
                            <option value="product_special">Special Product</option>
                        </select>
                        <label className='form-label fw-bold' htmlFor="status">Status:</label>
                        <select className="form-select mb-2" id="status" aria-label="Default select example">
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
                        <Link to="../product" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            Back Product
                        </Link>
                        <br />
                        <div className="row mt-5">
                            <div className="col-6">
                                <button className="btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUp}>
                                    <AiOutlineClear className='fs-4' />
                                    Clear up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>

        </>
    );
};

export default Edit;
