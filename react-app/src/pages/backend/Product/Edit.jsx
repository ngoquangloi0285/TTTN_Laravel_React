import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
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

export default function Edit(props) {
    // data product
    const getProduct = props.product;

    const { user } = useAuthContext();
    const timeZone = moment.tz.guess();
    const now = moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    const [isLoading, setIsLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const getCategories = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/category/v1/category');
            setIsLoading(false)
            setCategories(response.data);
        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    };
    //   tìm id category trùng với id trong bảng category
    const category = categories.find(c => c.category_id === getProduct.category_id);
    // khi trùng id thì lấy name_category ra
    const categoryName = category ? category.name_category : '';

    const [brands, setBrands] = useState([]);
    const getBrands = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/category/v1/brands');
            setIsLoading(false)
            setBrands(response.data);

        } catch (error) {
            setIsLoading(false)

            console.error(error);
        }
    };
    //   tìm id brands trùng với id trong bảng category
    const brand = brands.find(c => c.brand_id === getProduct.brand_id);
    // khi trùng id thì lấy name_brands ra
    const brandName = brand ? brand.name : '';

    const [artTimeArr, setStartTimeArr] = useState([]);

    const getStart_EndTime = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/countdown/v1/countdown');
            setIsLoading(false)
            setStartTimeArr(response.data);
        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    };

    const start_end_time = artTimeArr.find(c => c.product_id === getProduct.product_id);
    // const getStart_Time = start_end_time ? new Date(start_end_time.start_time).toISOString().slice(0, 16) : '';
    // const getEnd_Time = start_end_time ? new Date(start_end_time.end_time).toISOString().slice(0, 16) : '';
    const getStart_Time = start_end_time ? start_end_time.start_time : '';
    const getEnd_Time = start_end_time ? start_end_time.end_time : '';



    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

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

    const [arrImages, setArrImages] = useState([]);

    const getProduct_Images = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/images/v1/images');
            setIsLoading(false)
            setArrImages(response.data);
            console.log(response.data)
        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    };
    console.log('arrImages:', arrImages); // có dữ liệu
    const image_0 = getProduct;
    const images = arrImages.filter(c => c.product_id === getProduct.product_id);
    images.unshift(image_0);


    useEffect(() => {
        if (getProduct) {
            getCategories();
            getBrands();
            getStart_EndTime();
            getProduct_Images();
        }
    }, [getProduct]);

    const ToBack = () => {
        setNameProduct(props.product.name_product);
        setSummary(props.product.summary);
        setCostProduct(props.product.cost);
        setPriceSale(props.product.price);
        setDiscount(props.product.discount);
        setColor(props.product.color);
        setInch(props.product.inch);
        setContent(props.product.detail);
        document.getElementById("category").selectedIndex = 0;
        document.getElementById("brand").selectedIndex = 0;
    }
    useEffect(() => {
        ToBack();
    }, [props.product]);

    const [nameProduct, setNameProduct] = useState();
    const [summary, setSummary] = useState();
    const [costProduct, setCostProduct] = useState();
    const [priceSale, setPriceSale] = useState();
    const [discount, setDiscount] = useState();
    const [color, setColor] = useState();
    const [inch, setInch] = useState();
    const [startTime, setStartTime] = useState(now.slice(0, 16));
    const [endTime, setEndTime] = useState(now.slice(0, 16));
    const [content, setContent] = useState('');
    const [showCategoryToast, setShowCategoryToast] = useState(false);
    const [showBrandToast, setShowBrandToast] = useState(false);

    const [errors, setError] = useState([]);
    const [status, setStatus] = useState(null);

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
        ToBack();
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
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        axios.get('api/brands/v1/brands')
            .then(response => {
                if (response.data.length === 0) {
                    setShowBrandToast(true);
                    setTimeout(() => setShowBrandToast(false), 10000);
                }
                setBrands(response.data);
            })
            .catch(error => {
                // console.log(error);
            });
    }, []);

    // kiểm tra các trường đã được thay đổi hay chưa
    const Changed = () => {
        const isNameProductChanged = nameProduct !== props.product.name_product;
    }
    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('detail', content);
        formData.append('status', status);
        // quét files images
        files.forEach(file => formData.append('images[]', file));

        setIsLoading(true);
        setError([]);
        setStatus(null)

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

        const nowDate = moment().tz(moment.tz.guess());
        const startDate = moment(startTime + ':00.000Z').tz(moment.tz.guess());
        const endDate = moment(endTime + ':00.000Z').tz(moment.tz.guess());

        if (startDate < nowDate.startOf('day')) {
            newErrors.startTime = 'Vui lòng chỉnh sửa Start time phải là ngày hiện tại hoặc sau ngày hiện tại.';
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
            setError(newErrors);
            setTimeout(() => {
                setError("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }

        if (Changed) {
            try {
                const response = await axios.post('/api/product/v1/create-product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setIsLoading(false);
                setStatus(response.data.success)
                ClearUp();
                console.log(response.data);
            } catch (error) {
                setIsLoading(false);
                if (error.response) {
                    setStatus(error.data.error)
                    setError(error.response.data.errors);
                }
            }
        }
    };
    useEffect(() => {
        if (status) {
            setTimeout(() => {
                setStatus(null);
            }, 10000);
        }
    }, [status]);

    return (
        <>
            <Meta title={"Edit Product"} />
            <form action=""
                onSubmit={handleSubmit}
            >
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label>
                            </div>
                        </div>
                        {status && (
                            <div className="alert1 alert-success1 show1 text-center fs-4" role="alert">
                                {status}
                            </div>
                        )}
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
                                value={nameProduct}
                                onChange={(e) => setNameProduct(e.target.value)}
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
                        <select className="form-select mb-2" id='category' aria-label="Default select example">
                            <option value={category ? category.category_id : ""} selected>
                                {categoryName ? `Selected: ${categoryName}` : 'Select category'}
                            </option>
                            {categories.map(category => (
                                <option className='' key={category.id} value={category.id}>{category.name_category}</option>
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
                            <option value={brand ? brand.id : ""} selected>
                                {brandName ? `Selected: ${brandName}` : 'Select category'}
                            </option>
                            {brands.map(brand => (
                                <option className='' key={brand.id} value={brand.id}>{brand.name}</option>
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
                            <div className="row my-3">
                                <div className="col-6">
                                    <div className="mb-2">
                                        <label className='form-label fw-bold' htmlFor="startTime">Start Time:</label>
                                        <p className='m-0'>selected end time: </p>
                                        <strong>{getStart_Time}</strong>
                                        <input
                                            className='form-control mt-2'
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
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
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            id='endTime'
                                            type="datetime-local"
                                            min="1970-01-01T00:00" // thời điểm tối thiểu có thể chọn
                                            max="9999-12-31T23:59" // thời điểm tối đa có thể chọn
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
                                <ReactQuill value={content} onChange={handleContentChange} />
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <label className='form-label fw-bold' htmlFor="detail">Upload Image:</label>
                        <input className='form-control' name='file[]' id='file' type="file" multiple
                            onChange={handleUpload}
                        />
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
