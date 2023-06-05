import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const NewContact = () => {
    const { currentUser } = useAuthContext();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [nameProduct, setNameProduct] = useState();
    const [summary, setSummary] = useState();
    const [costProduct, setCostProduct] = useState();
    const [priceSale, setPriceSale] = useState();
    const [discount, setDiscount] = useState();
    const [color, setColor] = useState();
    const [inch, setInch] = useState();
    const [total, setTotal] = useState();

    const timeZone = 'America/New_York';
    const now = moment().tz(timeZone).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
    const [startTime, setStartTime] = useState(now.slice(0, 16));
    const [endTime, setEndTime] = useState(now.slice(0, 16));

    const [content, setContent] = useState('');

    const [showCategoryToast, setShowCategoryToast] = useState(false);
    const [showBrandToast, setShowBrandToast] = useState(false);

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState([]);

    const [status, setStatus] = useState(null);

    const handleUpload = (event) => {
        event.preventDefault();
        const fileList = event.target.files;
        const newFiles = Array.from(fileList);
        const shouldAddFiles = newFiles.filter(file => !files.some(f => f.name === file.name));
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
        document.getElementById("category").value = "";
        document.getElementById("brand").value = "";
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
    }

    const handleContentChange = (value) => {
        setContent(value);
        if (files.length) {
            console.log(files)
        }
    };

    useEffect(() => {
        axios.get('api/category/v1/category')
            .then(response => {
                if (response.data.length === 0) {
                    setShowCategoryToast(true);
                    setTimeout(() => setShowCategoryToast(false), 10000);
                }
                setIsLoading(false);
                setCategories(response.data);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            });

        axios.get('api/brand/v1/brand')
            .then(response => {
                if (response.data.length === 0) {
                    setShowBrandToast(true);
                    setTimeout(() => setShowBrandToast(false), 10000);
                }
                setIsLoading(false);
                setBrands(response.data);
            })
            .catch(error => {
                setIsLoading(false);
                // console.log(error);
            });
    }, []);



    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn_create');

        // lấy dữ liệu thì form
        const status = document.getElementById("status").value;
        const category = document.getElementById("category").value;
        const brand = document.getElementById("brand").value;
        const nameProduct = document.getElementById("nameProduct").value;
        const summary = document.getElementById("summary").value;
        const costProduct = document.getElementById("costProduct").value;
        const priceSale = document.getElementById("priceSale").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const color = document.getElementById("color").value;
        const inch = document.getElementById("inch").value;
        const total = document.getElementById("total").value;

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
        if (isNaN(discount)) {
            newErrors.discount = "Giảm giá phải là số.";
        } else if (discount <= 0) {
            newErrors.discount = "Giảm giá phải lớn hơn 0.";
        } else if (discount > 100) {
            newErrors.discount = "Giảm giá phải nhỏ hơn hoặc bằng 100.";
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
        if (isNaN(total)) {
            newErrors.total = "Total phải là số.";
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
        formData.append('discount', discount);
        formData.append('color', color);
        formData.append('inch', inch);
        formData.append('total', total);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('detail', content);
        formData.append('status', status);
        // quét files images
        files.forEach(file => formData.append('images[]', file));
        console.log(formData)
        try {
            btn.innerHTML = "Creating...";
            const response = await axios.post('/api/product/v1/create-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                Swal.fire(
                    'success',
                    response.data.status,
                    'success'
                )
            }
            btn.innerHTML = "Create New Product";
            ClearUp();
        } catch (error) {
            setIsLoading(false);
            setIsLoading(false);
            // Nếu xảy ra lỗi, hiển thị thông báo lỗi
            if (error.response.status === 500) {
                Swal.fire('Error!', error.response.data.error, 'error');
            } else {
                Swal.fire('Error!', 'Failed to create new Product.', 'error');
            }
            btn.innerHTML = "Create New Product";
        }
    };
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
            <Meta title={"Create Contact"} />
            <div className="row">
                <form action="" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <div className='d-flex align-items-center justify-content-center'>
                                <div className="mb-2 text-center">
                                    <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{currentUser?.name}</span></label>
                                </div>
                            </div>
                            <button className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                                <IoCreateOutline className='fs-4' />
                                Create new Contact
                            </button>
                            <Link to="../contact" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Back Contact
                            </Link>

                        </div>
                        <div className="col-3">
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="nameproduct">Name Product:</label>
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
                                <option value="" selected>Select Category</option>
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
                                <option value="" selected>Select Brand</option>
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
                                            onChange={(e) => setDiscount(e.target.value)}
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
                                <div className="col-4">
                                    <label className='form-label fw-bold' htmlFor="inch">Total:</label>
                                    <input className='form-control'
                                        value={total}
                                        onChange={(e) => setTotal(e.target.value)}
                                        id='total' type="text" placeholder='Enter total' />
                                    {errors.total && (
                                        <div className="alert alert-danger"
                                            style={
                                                { fontSize: '14px' }
                                            }
                                            role="alert">
                                            {errors.total}
                                        </div>
                                    )}
                                </div>
                                <div className="row my-3">
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
                            <Link to="../contact" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Back Contact
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
                </form>
            </div>

        </>
    );
};

export default NewContact;
