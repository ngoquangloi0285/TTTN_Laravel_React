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
    const { user } = useAuthContext();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [titleNews, setTitleNews] = useState();
    const [content, setContent] = useState('');

    const [showCategoryToast, setShowCategoryToast] = useState(false);

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
        setTitleNews("");
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
    }, []);

    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn_create');

        // lấy dữ liệu thì form
        const status = document.getElementById("status").value;
        const category = document.getElementById("category").value;
        // const nameProduct = document.getElementById("nameProduct").value;

        // định nghĩa lỗi
        const newErrors = {};
        if (!titleNews) {
            newErrors.titleNews = "Vui lòng nhập tiêu đề tin tức.";
        }
        if (!category) {
            newErrors.category = "Vui lòng chọn danh mục.";
        }

        if (!content) {
            newErrors.content = "Vui lòng nhập nội dung tin tức.";
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
        formData.append('titleNews', titleNews);
        formData.append('category', category);
        formData.append('contentNews', content);
        formData.append('status', status);
        // quét files images
        files.forEach(file => formData.append('images[]', file));
        console.log(formData)
        try {
            btn.innerHTML = "Creating...";
            const response = await axios.post('/api/news/v1/create-news', formData, {
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
            btn.innerHTML = "Create New News";
            ClearUp();
        } catch (error) {
            setIsLoading(false);
            setIsLoading(false);
            // Nếu xảy ra lỗi, hiển thị thông báo lỗi
            if (error.response.status === 500) {
                Swal.fire('Error!', error.response.data.error, 'error');
            } else {
                Swal.fire('Error!', 'Failed to create new News.', 'error');
            }
            btn.innerHTML = "Create New News";
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
            <Meta title={"Create New News"} />
            <div className="row">
                <form action="" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <div className='d-flex align-items-center justify-content-center'>
                                <div className="mb-2 text-center">
                                    <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{user?.name}</span></label>
                                </div>
                            </div>
                            <button className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                                <IoCreateOutline className='fs-4' />
                                Create new News
                            </button>
                            <Link to="../news" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Back News
                            </Link>

                        </div>
                        <div className="col-3">
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="titleNews">Title News:</label>
                                <input
                                    value={titleNews}
                                    onChange={(e) => setTitleNews(e.target.value)}
                                    className='form-control' id='titleNews' type="text" placeholder='Enter Title News' />
                                {errors.titleNews && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.titleNews}
                                    </div>
                                )}
                            </div>

                            <label className='form-label fw-bold' htmlFor="category">Category News:</label>
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
                        </div>
                        <div className="col-5">
                            <label className='form-label fw-bold' htmlFor="detail">Content News:</label>
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
                            <Link to="../news" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Back News
                            </Link>
                            <br />
                            <div className="row mt-5">
                                <div className="col-6">
                                    <button className="mb-5 btn btn-danger d-flex text-white mx-2" type="button" onClick={ClearUp}>
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

export default NewProduct;
