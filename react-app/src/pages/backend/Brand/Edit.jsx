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
import Swal from "sweetalert2";

const EditBrand = () => {
    const { id } = useParams(); // lấy ID từ URL
    const { currentUser } = useAuthContext();
    const [brands, setBands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const navigate = useNavigate();
    const [nameBrand, setNameBrand] = useState('');
    const [brandID, setBrandID] = useState();
    const [brand, setBrand] = useState();
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

    const ClearUp = useCallback(() => {
        setBands("");
        setBrandID("");
        document.getElementById("file").value = "";
        document.getElementById("status").value = "";
        clearImageUrls();
    }, [clearImageUrls])

    const [image, setImage] = useState();

    useEffect(() => {
        Promise.all([
            axios.get(`api/brand/v1/edit/${id}`)
        ])
            .then(([editResponse]) => {
                if (editResponse.data.status === 200) {
                    setNameBrand(editResponse.data.brand.name);
                    setBrandID(editResponse.data.brand.id);
                }
                // Lấy ra danh sách ảnh của category và lưu vào state arrImages
                const image = editResponse.data.brand.image;
                setImage(image);
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error);
                if (error.response) {
                    const { status, message } = error.response.data;
                    if (status === 404) {
                        toast.error(message);
                    }
                }
                setIsLoading(false)
            });
    }, [setBrandID, id]);

    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = useCallback(async () => {
        const btn = document.getElementById('btn_create');
        const option_status = document.getElementById('status').value;

        // định nghĩa lỗi
        const newErrors = {};
        if (!nameBrand) {
            newErrors.nameBrand = "Vui lòng nhập tên danh mục.";
        }
        
        if (files.length > 1) {
            newErrors.files = "Chỉ được phép tải lên 1 tập tin.";
        }
        if (!option_status) {
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
        formData.append('nameBrand', nameBrand);
        formData.append('status', option_status);
        files.forEach(file => formData.append('images[]', file));

        console.log(formData)
        try {
            btn.innerHTML = "Updating...";
            const response = await axios.post(`/api/brand/v1/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            btn.innerHTML = "Update Brand";
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.status,
                    confirmButtonText: 'Back to Brand'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('../brand')
                    }
                });
            }
            // ClearUp();
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
                // toast.error(error.response.data.error);
                Swal.fire(
                    'error',
                    error.data.status,
                    'error'
                )
            }
        }
    }, [files, id, nameBrand, navigate, brand]);
    // xác nhận  update
    const confirmUpdate = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to update Category this!',
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
        return <>
            <LoadingOverlay className='text-danger'
                spinner
                active={isLoading}
                text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
                }
            ></LoadingOverlay>
        </>
    }

    return (
        <>
            <Meta title={"Edit Brand"} />
            <div className="row">
                <div className="row">
                    <div className="col-12">
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{currentUser?.name}</span></label>
                            </div>
                        </div>
                        <button onClick={confirmUpdate} className="btn btn-success text-white mr-2" type="submit" id='btn_create'>
                            <IoCreateOutline className='fs-4' />
                            Update brand: <strong className='text-dark'>{id}</strong>
                        </button>
                        <Link to="../brand" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            To back brand
                        </Link>
                    </div>
                    <div className="col-4">
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="name_category">Name Brand:</label>
                            <input
                                value={nameBrand}
                                onChange={(e) => setNameBrand(e.target.value)}
                                className='form-control text-info' id='name_brand' type="text" placeholder='Enter Brand Name' />
                            {errors.nameBrand && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.nameBrand}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-5">
                        <label className='form-label fw-bold' htmlFor="detail">Upload Image:</label>
                        <input className='form-control mb-2' name='file[]' id='file' type="file" multiple onChange={handleUpload} />
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
                            {
                                files.length > 0 &&
                                <p className='m-0'><strong>Không bắt buộc!</strong></p>
                            }
                            {renderPreview()}

                        </div>
                        {
                            files.length > 0 &&
                            <button className="btn btn-danger d-flex text-white my-2" type="button" onClick={ClearUpPhotos}>
                                <AiOutlineClear className='fs-4' />
                                Clean up photos
                            </button>
                        }
                        {
                            image === null ? "" :
                                <div style={{ width: '100%' }}>
                                    <h4 className='mt-3'>Images selected: </h4>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <img className='img img-fluid img-thumbnail'
                                            style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }}
                                            src={`http://localhost:8000/storage/brand/${image}`}
                                            alt={image.image}
                                        />
                                    </div>
                                </div>
                        }
                        <label className='form-label fw-bold' htmlFor="status">Status:</label>
                        <select className="form-select" id="status" aria-label="Default select example">
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
                        <Link to="../brand" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            To back Brand
                        </Link>
                        <br />
                        <div className="row my-5">
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

export default EditBrand;
