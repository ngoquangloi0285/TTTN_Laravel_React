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
    const [options, setOptions] = useState([]);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    // const [isLoading, setIsLoading] = useState(false);

    // cho phép upload nhiều hình
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
        axios.get('api/v1/options')
            .then(response => {
                setOptions(response.data);
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
        document.getElementById("file").value = "";
        setNameProduct([]);
        setSummary([]);
        setCostProduct([]);
        setPriceSale([]);
        setDiscount([]);
        setCountDown([]);
        setContent([]);
        clearImageUrls();
    }
    // Xử lý API Create New Product
    const [nameProduct, setNameProduct] = useState();
    const [summary, setSummary] = useState();
    const [costProduct, setCostProduct] = useState();
    const [priceSale, setPriceSale] = useState();
    const [discount, setDiscount] = useState();
    const [countDown, setCountDown] = useState();
    const image = files;
    const detail = content;
    const [errors, setError] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const color = document.getElementById("color").value;
        const inch = document.getElementById("inch").value;
        const status = document.getElementById("status").value;
        const category = document.getElementById("category").value;
        const brand = document.getElementById("brand").value;
        const data = {
            name: nameProduct,
            category: category,
            brand: brand,
            summary: summary,
            costProduct: costProduct,
            priceSales: priceSale,
            discount: discount,
            color: color,
            inch: inch,
            countDown: countDown,
            detail: detail,
            image: image,
            status: status,
        };
        setError([]);
        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/create-product', data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.errors);
            console.error(error);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className='d-flex align-items-center justify-content-center'>
                        <div className="mb-2 text-center">
                            <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label>
                        </div>
                    </div>
                    <div className='mb-2 text-center position-absolute cancel'>
                        <button className="btn btn-success text-white mx-2" onClick={handleSubmit} type="button">
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
                            className='form-control' id='nameproduct' type="text" placeholder='Enter Product Name' />
                        {errors.nameProduct &&
                            <div className="d-flex">
                                <span className="text-danger">{errors.nameProduct[0]}</span>
                            </div>}
                    </div>

                    <label className='form-label fw-bold' htmlFor="category">Category Product:</label>
                    <select className="form-select mb-2" id='category' aria-label="Default select example">
                        <option value="" selected>Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name_category}</option>
                        ))}
                    </select>
                    {errors.category &&
                        <div className="d-flex">
                            <span className="text-danger">{errors.category[0]}</span>
                        </div>}

                    <label className='form-label fw-bold' htmlFor="brand">Brand Product:</label>
                    <select className="form-select mb-2" id="brand" aria-label="Default select example">
                        <option value="" selected>Select Brand</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                    {errors.brand &&
                        <div className="d-flex">
                            <span className="text-danger">{errors.brand[0]}</span>
                        </div>}

                    <label className='form-label fw-bold' htmlFor="floatingTextarea">Summary:</label>
                    <div className="form-floating mb-2">
                        <textarea className="form-control"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">Summary:</label>
                        {errors.summary &&
                            <div className="d-flex">
                                <span className="text-danger">{errors.summary[0]}</span>
                            </div>}
                    </div>
                </div>
                <div className="col-5">
                    <label className='form-label fw-bold' htmlFor="floatingTextarea">Price:</label>
                    <div className="row">
                        <div className="col-4">
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="cost">Cost (giá góc):</label>
                                <input className='form-control'
                                    value={costProduct}
                                    onChange={(e) => setCostProduct(e.target.value)}
                                    id='cost' type="text" placeholder='Enter cost' />
                                {errors.costProduct &&
                                    <div className="d-flex">
                                        <span className="text-danger">{errors.costProduct[0]}</span>
                                    </div>}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="pricesale">Price (giá bán):</label>
                                <input className='form-control'
                                    value={priceSale}
                                    onChange={(e) => setPriceSale(e.target.value)}
                                    id='pricesale' type="text" placeholder='Enter price' />
                                {errors.priceSale &&
                                    <div className="d-flex">
                                        <span className="text-danger">{errors.priceSale[0]}</span>
                                    </div>}
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
                            <label className='form-label fw-bold' htmlFor="inch">Color:</label>
                            <select className="form-select mb-2" id="color" aria-label="Default select example">
                                <option value="" selected>Select Color</option>
                                {options.map(option => (
                                    <option key={option.id} value={option.id}>{option.color}</option>
                                ))}
                            </select>
                            {errors.color &&
                                <div className="d-flex">
                                    <span className="text-danger">{errors.color[0]}</span>
                                </div>}
                        </div>
                        <div className="col-4">
                            <label className='form-label fw-bold' htmlFor="inch">Inch:</label>
                            <select className="form-select mb-2" id="inch" aria-label="Default select example">
                                <option value="" selected>Select Inch</option>
                                {options.map(option => (
                                    <option key={option.id} value={option.id}>{option.inch}</option>
                                ))}
                            </select>
                            {errors.inch &&
                                <div className="d-flex">
                                    <span className="text-danger">{errors.inch[0]}</span>
                                </div>}
                        </div>
                        <div className="col-4">
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="date">Count Down:</label>
                                <input className='form-control'
                                    value={countDown}
                                    onChange={(e) => setCountDown(e.target.value)}
                                    id='date' type="date" />
                            </div>
                        </div>
                    </div>
                    <label className='form-label fw-bold' htmlFor="detail">Detail:</label>
                    <div className="form-floating mb-2">
                        <div className="" >
                            <ReactQuill value={content} onChange={handleContentChange} />
                            {errors.detail &&
                                <div className="d-flex">
                                    <span className="text-danger">{errors.detail[0]}</span>
                                </div>}
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <label className='form-label fw-bold' htmlFor="detail">Upload Image:</label>
                    <input className='form-control' id='file' type="file" multiple onChange={handleUpload} />
                    {errors.image &&
                        <div className="d-flex">
                            <span className="text-danger">{errors.image[0]}</span>
                        </div>}
                    <div className="row">
                        {renderPreview()}
                    </div>
                    <br />
                    <label className='form-label fw-bold' htmlFor="status">Status:</label>
                    <select className="form-select mb-2" id="status" aria-label="Default select example">
                        <option value="" selected>Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors.status &&
                        <div className="d-flex">
                            <span className="text-danger">{errors.status[0]}</span>
                        </div>}
                    <br />
                    <button className="btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUp}>
                        <AiOutlineClear className='fs-4' />
                        Clear up
                    </button>
                </div>
            </div>
        </>
    );
};

export default NewProduct;
