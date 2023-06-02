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

const NewProduct = () => {
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

    const [showDateTimeFields, setShowDateTimeFields] = useState(false);

    const handleEndDateChange = (e) => {
        setShowDateTimeFields(e.target.checked);
    };
    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn_create');

        // lấy dữ liệu thì form
        const status = document.getElementById("status").value;
        const category = document.getElementById("category").value;
        const brand = document.getElementById("brand").value;
        // const nameProduct = document.getElementById("nameProduct").value;
        // const summary = document.getElementById("summary").value;
        // const costProduct = document.getElementById("costProduct").value;
        // const priceSale = document.getElementById("priceSale").value;
        // const startTime = document.getElementById("startTime").value;
        // const endTime = document.getElementById("endTime").value;
        // const color = document.getElementById("color").value;
        // const inch = document.getElementById("inch").value;
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
        // if (color) {
        //     newErrors.color = "Vui lòng nhập màu.";
        // }
        if (isNaN(inch)) {
            newErrors.inch = "Inch phải là số.";
        }
        

        const nowDate = moment().tz(moment.tz.guess());
        const startDate = moment(startTime + ':00.000Z').tz(moment.tz.guess());
        const endDate = moment(endTime + ':00.000Z').tz(moment.tz.guess());

        if (showDateTimeFields) {

            if (startDate < nowDate.startOf('day')) {
                newErrors.startTime = 'Start time phải là ngày hiện tại hoặc sau ngày hiện tại.';
            }
            if (endDate <= nowDate) {
                newErrors.endTime = 'Ngày kết thúc không được nhỏ hơn ngày hiện tại.';
            } else if (endDate.diff(startDate, 'days') > 30) {
                newErrors.endTime = 'Ngày kết thúc không được quá 1 tháng so với ngày bắt đầu.';
            } else if (endDate <= startDate) {
                newErrors.endTime = 'Ngày kết thúc không được nhỏ hơn hoặc bằng ngày bắt đầu.';
            } else if (endDate.isSame(startDate)) {
                newErrors.endTime = 'Ngày kết thúc không được bằng với ngày bắt đầu.';
            }
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
        formData.append('color', color ? color : '');
        formData.append('inch', inch ? inch : '');
        formData.append('type', type);
        formData.append('start_time', startTime ? startTime : '');
        formData.append('end_time', endTime ? endTime : '');
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
            if (error.response.status) {
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
            <Meta title={"Create Product"} />
            <div className="row">
                <form action="" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <div className='d-flex align-items-center justify-content-center'>
                                <div className="mb-2 text-center">
                                    <label className='form-label fw-bold' htmlFor="author">Tác giả: <span className='text-danger'>{currentUser?.name}</span></label>
                                </div>
                            </div>
                            <button className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                                <IoCreateOutline className='fs-4' />
                                Tạo
                            </button>
                            <Link to="../product" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Quay về
                            </Link>

                        </div>
                        <div className="col-3 mt-2">
                            <div className="">
                                <label className='form-label fw-bold' htmlFor="nameproduct">Tên sản phẩm:</label>
                                <input
                                    value={nameProduct}
                                    onChange={(e) => setNameProduct(e.target.value)}
                                    className='form-control' id='nameProduct' type="text" placeholder='Samsung Galaxy A24' />
                                {errors.nameProduct && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.nameProduct}
                                    </div>
                                )}
                            </div>

                            <label className='form-label fw-bold' htmlFor="category">Danh mục:</label>
                            {showCategoryToast && (
                                <Toast bg="warning" delay={5000} autohide onClose={() => setShowCategoryToast(false)} style={{ width: "100%", height: "50px" }}>
                                    <Toast.Body className='my-toast fw-bold fs-6'>Danh mục không có dữ liệu</Toast.Body>
                                </Toast>
                            )}
                            <select className="form-select mb-2" id='category' aria-label="Default select example">
                                <option value="" selected>Chọn danh mục</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name_category}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.category}
                                </div>
                            )}

                            <label className='form-label fw-bold' htmlFor="brand">Thương hiệu:</label>
                            {showBrandToast && (
                                <Toast bg="warning" delay={5000} autohide onClose={() => setShowBrandToast(false)} style={{ width: "100%", height: "50px" }}>
                                    <Toast.Body className='my-toast fw-bold fs-6'>Thương hiệu không có dữ liệu</Toast.Body>
                                </Toast>
                            )}

                            <select className="form-select mb-2" id="brand" aria-label="Default select example">
                                <option value="" selected>Chọn thương hiệu</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                            {errors.brand && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.brand}
                                </div>
                            )}

                            <label className='form-label fw-bold' htmlFor="summary">Tóm tắt:</label>
                            <div className="form-floating mb-2">
                                <textarea className="form-control"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Leave a comment here" id="summary"></textarea>
                                <label for="summary">Tóm tắt:</label>
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
                                        <label className='form-label fw-bold' htmlFor="costProduct">Giá góc:</label>
                                        <input className='form-control'
                                            value={costProduct}
                                            onChange={(e) => setCostProduct(e.target.value)}
                                            id='costProduct' type="text" placeholder='899' />
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
                                        <label className='form-label fw-bold' htmlFor="priceSale">Giá bán:</label>
                                        <input className='form-control'
                                            value={priceSale}
                                            onChange={(e) => setPriceSale(e.target.value)}
                                            id='priceSale' type="text" placeholder='899' />
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
                                        <label className='form-label fw-bold' htmlFor="discount">Giảm giá(%):</label>
                                        <input className='form-control'
                                            value={discount}
                                            // onChange={(e) => setDiscount(e.target.value)}
                                            onChange={handleDiscountChange}
                                            id='discount' maxLength={3} type="text" placeholder='10%' />
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
                                <div className="col-6">
                                    <label className='form-label fw-bold' htmlFor="color">Màu sản phẩm:</label>
                                    <input className='form-control'
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        id='color' type="text" placeholder='Red' />
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
                                <div className="col-6">
                                    <label className='form-label fw-bold' htmlFor="inch">Kích thước sản phẩm(inch):</label>
                                    <input className='form-control'
                                        value={inch}
                                        onChange={(e) => setInch(e.target.value)}
                                        id='inch' type="text" placeholder='7' />
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
                                    <div className="col-12">
                                        <div className="mb-2">
                                            <label className='form-label fw-bold' htmlFor="endDate">Chọn ngày kết thúc bán sản phẩm:</label>
                                            <input
                                                onChange={handleEndDateChange}
                                                id='endDate'
                                                type="checkbox"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {showDateTimeFields && (
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="mb-2">
                                                <label className='form-label fw-bold' htmlFor="startTime">Ngày bắt đầu:</label>
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
                                                <label className='form-label fw-bold' htmlFor="endTime">Ngày kết thúc:</label>
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
                                )}
                            </div>
                            <label className='form-label fw-bold' htmlFor="detail">Chi tiết sản phẩm:</label>
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
                            <label className='form-label fw-bold' htmlFor="detail">Thêm ảnh:</label>
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
                                    <button className="btn btn-danger d-flex text-white my-2" type="button" onClick={ClearUpPhotos}>
                                        <AiOutlineClear className='fs-4' />
                                        Xóa hình ảnh
                                    </button>
                                </div>
                            }
                            <br />
                            <label className='form-label fw-bold' htmlFor="status">Loại sản phẩm được đăng:</label>
                            <select className="form-select mb-2" id="type" aria-label="Default select example"
                                value={statusType}
                                onChange={(e) => setStatusType(e.target.value)}
                            >
                                <option value="new_product" selected>Sản phẩm mới</option>
                                {discount &&
                                    <option value="product_sale">Sản phẩm giảm giá</option>
                                }
                                <option value="product_special">Sản phẩm đặt biệt</option>
                            </select>
                            {/* {errors.type && (
                                <div className="alert alert-danger"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                    role="alert">
                                    {errors.type}
                                </div>
                            )} */}
                            <label className='form-label fw-bold' htmlFor="status">Trạng thái:</label>
                            <select className="form-select mb-2" id="status" aria-label="Default select example">
                                <option value="" selected>Chọn trạng thái</option>
                                <option value="1">Đăng</option>
                                <option value="0">Không Đăng</option>
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
                            <button className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                                <IoCreateOutline className='fs-4' />
                                Tạo
                            </button>
                            <br />
                            <div className="row mt-5">
                                <div className="col-6">
                                    <button className="btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUp}>
                                        <AiOutlineClear className='fs-4' />
                                        Làm lại
                                    </button>
                                </div>
                            </div>
                            <br />
                            <br />
                        </div>
                    </div>
                    <ToastContainer />
                </form>
            </div>

        </>
    );
};

export default NewProduct;
