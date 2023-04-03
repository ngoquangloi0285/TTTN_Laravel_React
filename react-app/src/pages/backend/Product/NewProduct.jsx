import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAuthContext from '../../../context/AuthContext';
import LoadingOverlay from 'react-loading-overlay';
import { ImCancelCircle } from 'react-icons/im';
import { IoCreateOutline } from 'react-icons/io5';
import { AiOutlineClear } from 'react-icons/ai';

const NewProduct = () => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    // cho phép upload nhiều hình
    const [files, setFiles] = useState([]);
    const handleUpload = (event) => {
        const fileList = event.target.files;
        setFiles([...files, ...fileList]);
    };
    // hiển thị ảnh upload tạm thời
    const renderPreview = () => {
        return files.map((file) => {
            const url = URL.createObjectURL(file);
            return (
                <div className='col-4' key={url}>
                    <img className='img-thumbnail' src={url} alt={file.name} />
                </div>
            );
        });
    };

    const handleContentChange = (value) => {
        setContent(value);
        if (files.length) {
            console.log(files)
        }
    };

    useEffect(() => {
        axios.get('api/v1/categorys')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        axios.get('api/v1/brands')
            .then(response => {
                setBrands(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    const clearImageUrls = () => {
        files.forEach((file) => URL.revokeObjectURL(file));
        setFiles([]);
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
        setStartTime("");
        setEndTime("");
        setContent("");
        document.getElementById("file").value = "";
        document.getElementById("status").value = "";
        clearImageUrls();
    }
    const ClearUpPhotos = (e) => {
        document.getElementById("file").value = "";
        clearImageUrls();
    }

    // Khai báo state cho các trường nhập liệu
    const [nameProduct, setNameProduct] = useState();
    const [summary, setSummary] = useState();
    const [costProduct, setCostProduct] = useState();
    const [priceSale, setPriceSale] = useState();
    const [discount, setDiscount] = useState();
    const [color, setColor] = useState();
    const [inch, setInch] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [content, setContent] = useState('');

    // Khai báo state cho thông báo lỗi
    const [errors, setError] = useState([]);

    const [status, setStatus] = useState(null);


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
        if (!priceSale) {
            newErrors.priceSale = "Vui lòng nhập giá bán.";
        }
        if (!color) {
            newErrors.color = "Vui lòng nhập màu.";
        }
        if (!inch) {
            newErrors.inch = "Vui lòng nhập icnh.";
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
            setIsLoading(true);
            setError(newErrors);
            setTimeout(() => {
                setError("");
            }, 10000); // Hiển thị thông báo lỗi trong 3 giây
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/v1/create-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            setStatus(response.data.success)

            console.log(response.data);
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                setStatus(error.data.error)
                setError(error.response.data.errors);
            }
        }
    };

    return (
        <>
            <form action="" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label>
                            </div>
                        </div>
                        {status && (
                            <div className="alert alert-success" role="alert">
                                {status}
                            </div>
                        )}
                        <div className='mb-2 text-center position-absolute cancel'>
                            <button className="btn btn-success text-white mx-2" type="submit">
                                <IoCreateOutline className='fs-4' />
                                Create new product
                            </button>
                            <button className="btn text-white mx-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
                                <ImCancelCircle className='fs-4' />
                                Cancel
                            </button>
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
                                className='form-control' id='nameProduct' type="text" placeholder='Enter Product Name' />
                            {errors.nameProduct && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.nameProduct}
                                </div>
                            )}
                        </div>

                        <label className='form-label fw-bold' htmlFor="category">Category Product:</label>
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
                        <label className='form-label fw-bold' htmlFor="floatingTextarea">Price:</label>
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
                                    <label className='form-label fw-bold' htmlFor="discount">Discount(-%):</label>
                                    <input className='form-control'
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        id='discount' type="text" placeholder='Enter discount' />
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
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="startTime">Start Time:</label>
                                    <input className='form-control'
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        id='startTime' type="date" />
                                </div>
                                <div className="mb-2">
                                    <label className='form-label fw-bold' htmlFor="endTime">End Time:</label>
                                    <input className='form-control'
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        id='endTime' type="date" />
                                </div>
                            </div>
                        </div>
                        <label className='form-label fw-bold' htmlFor="detail">Detail:</label>
                        <div className="form-floating mb-2">
                            <div className="" >
                                <ReactQuill value={content} onChange={handleContentChange} />
                                {errors.content && (
                                    <div className="alert alert-danger"
                                        style={
                                            { fontSize: '14px' }
                                        }
                                        role="alert">
                                        {errors.content}
                                    </div>
                                )}
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
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUp}>
                                    <AiOutlineClear className='fs-4' />
                                    Clear up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default NewProduct;
