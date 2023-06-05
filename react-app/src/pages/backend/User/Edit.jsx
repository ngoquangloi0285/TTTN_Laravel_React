import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { Toast, Container } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import useAuthContext from '../../../context/AuthContext';
import LoadingOverlay from 'react-loading-overlay';
import { IoCreateOutline } from 'react-icons/io5';
import { AiOutlineClear, AiOutlineRollback } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

const EditUser = () => {

    const { id } = useParams(); // lấy ID từ URL
    const encodedId = encodeURIComponent(id);

    const { currentUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState([]);
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

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
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setGender("");
        setRole("");
        setPassword("");
        setPasswordConfirmation("");
        document.getElementById("file").value = "";
        document.getElementById("status").value = "";
        clearImageUrls();
    }, [clearImageUrls])

    const [users, setUser] = useState([]);
    const [arrImages, setArrImages] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get(`api/user/v1/edit/${encodedId}`),
        ])
            .then(([userResponse]) => {
                if (userResponse.data) {
                    setUser(userResponse.data);
                }
                if (userResponse.data) {
                    setName(userResponse.data.user.name);
                    setEmail(userResponse.data.user.email);
                    setPhone(userResponse.data.user.phone);
                    setAddress(userResponse.data.user.address);
                    setGender(userResponse.data.user.gender);
                    setArrImages(userResponse.data.user.avatar);
                    setRole(userResponse.data.user.roles);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            });
    }, [encodedId]);

    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = useCallback(async () => {
        // e.preventDefault();

        const btn = document.getElementById('btn_create');
        const option_status = document.getElementById('status').value;

        // định nghĩa lỗi
        const newErrors = {};
        if (!name) {
            newErrors.name = "Vui lòng nhập tên người dùng.";
        }
        if (!email) {
            newErrors.email = "Vui lòng nhập email người dùng.";
        }
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại người người dùng.";
        }
        if (!address) {
            newErrors.address = "Vui lòng nhập địa chỉ người dùng.";
        }
        if (!gender) {
            newErrors.gender = "Vui lòng nhập giới tính người dùng.";
        }
        if (!role) {
            newErrors.role = "Vui lòng nhập quyền truy cập.";
        }
        if (files.length > 1) {
            newErrors.files = "Chỉ được phép tải lên 1 tập tin.";
        }
        if (!option_status) {
            newErrors.status = "Vui lòng chọn trạng thái.";
        }
        if (!password || !currentPassword) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
        } else if (!password_confirmation) {
            newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu.";
        } else if (password_confirmation !== password) {
            newErrors.password_confirmation = "Xác nhận mật khẩu không trùng khớp.";
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
        // mã hóa password
        // const hashedPassword = bcrypt.hashSync(password, 10);
        // chèn dữ liệu
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('gender', gender);
        formData.append('role', role);
        formData.append('currentPassword', currentPassword);
        formData.append('password', password);
        formData.append('status', option_status);
        files.forEach(file => formData.append('images[]', file));

        console.log(formData)
        try {
            btn.innerHTML = "Updating...";
            const response = await axios.post(`/api/user/v1/update-user/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            btn.innerHTML = "Update User";
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                // Nếu thành công, hiển thị thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.status,
                    confirmButtonText: 'Back to User'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('../user')
                    }
                });
            }
            ClearUp();
        } catch (error) {
            // Xử lý lỗi
            setIsLoading(false);
            setIsLoading(false);
            if (error.response.data.status === 'error') {
                Swal.fire('Error!', error.response.data.message, 'error');
            }
            if (error.response && error.response.data && error.response.data.message) {
                // Nếu có thông báo lỗi từ phía server, hiển thị nó trên giao diện
                setErrorMessage(error.response.data.message);
            } else {
                // Nếu không có thông báo lỗi từ phía server, hiển thị một thông báo lỗi chung
                setErrorMessage('Something went wrong. Please try again later.');
            }
            //  else {
            //     Swal.fire('Error!', 'Please double check the input or maybe this email already exists.', 'error');
            // }
            btn.innerHTML = "Update  User";
        }
    }, [ClearUp, name, phone, address, email, files, gender, role, password, password_confirmation, currentPassword, encodedId, navigate]);

    const confirmUpdate = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to update User this!',
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
            <Meta title={"Update User"} />
            <div className="row">
                <div className="row">
                    <div className="col-12">
                        {/* Hiển thị thông báo lỗi nếu có */}
                        {errorMessage && (
                            <div className="alert alert-danger">{errorMessage}</div>
                        )}
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className="mb-2 text-center">
                                <label className='form-label fw-bold' htmlFor="author">Author: <span className='text-danger'>{currentUser?.name}</span></label>
                            </div>
                        </div>
                        <button className="btn btn-success text-white mr-2" onClick={confirmUpdate} type="submit" id='btn_create'>
                            <IoCreateOutline className='fs-4' />
                            Update User
                        </button>
                        <Link to="../user" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            Back User
                        </Link>
                    </div>
                    <div className="col-4">
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="name">Name:</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='form-control' id='name' type="text" placeholder='Enter Name' />
                            {errors.name && (
                                <div className="alert alert-danger" role="alert"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                >
                                    {errors.name}
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="email">Email:</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='form-control' id='email' type="email" placeholder='Enter Email' />
                            {errors.email && (
                                <div className="alert alert-danger" role="alert"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                >
                                    {errors.email}
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="currentPassword">Current Password:</label>
                            <input
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className='form-control' id='currentPassword' type="password" placeholder='Enter Current Password' />
                            {errors.currentPassword && (
                                <div className="alert alert-danger" role="alert"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                >
                                    {errors.currentPassword}
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="password">New Password:</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='form-control' id='password' type="password" placeholder='Enter New Password' />
                            {errors.password && (
                                <div className="alert alert-danger" role="alert"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                >
                                    {errors.password}
                                </div>
                            )}
                        </div>
                        {
                            password &&
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="password_confirmation">Password Confirmation:</label>
                                <input
                                    value={password_confirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className='form-control' id='password_confirmation' type="password" placeholder='Enter Password Confirmation' />
                                {errors.password_confirmation && (
                                    <div className={`alert ${errors.password_confirmation.valid ? "alert-success" : "alert-danger"}`} role="alert"
                                        style={
                                            { fontSize: '14px' }
                                        }
                                    >
                                        {errors.password_confirmation.valid ? <i className="bi bi-check-circle-fill me-2"></i> : <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                                        {errors.password_confirmation.valid ? "Passwords match!" : errors.password_confirmation}
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    <div className="col-4">
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="phone">Phone Number:</label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='form-control' id='phone' type="text" placeholder='Enter Phone Number' />
                            {errors.phone && (
                                <div className="alert alert-danger" role="alert"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                >
                                    {errors.phone}
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="address">Address:</label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className='form-control' id='address' type="text" placeholder='Enter Address' />
                            {errors.address && (
                                <div className="alert alert-danger" role="alert"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                >
                                    {errors.address}
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="gender">Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select" id="gender" aria-label="Default select example">
                                <option value="" selected>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.gender && (
                                <div className="alert alert-danger"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                    role="alert">
                                    {errors.gender}
                                </div>
                            )}
                        </div>

                        <div className="mb-2">
                            <label className='form-label fw-bold' htmlFor="role">Role:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select" id="role" aria-label="Default select example">
                                <option value="" selected>Select Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.gender && (
                                <div className="alert alert-danger"
                                    style={
                                        { fontSize: '14px' }
                                    }
                                    role="alert">
                                    {errors.gender}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-4">
                        <label className='form-label fw-bold' htmlFor="file">Avatar:</label>
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
                            arrImages === null ? `Not has any images in datastore!` :
                                <div style={{ width: '100%' }}>
                                    <h4 className='mt-3'>Images selected: </h4>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                                        <img className='img img-fluid img-thumbnail'
                                            style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }}
                                            src={`http://localhost:8000/storage/user/${arrImages}`}
                                            alt={arrImages}
                                        />
                                    </div>
                                </div>
                        }
                        <br />
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
                        <Link to="../user" className="btn btn-info text-white mr-2" type="button">
                            <AiOutlineRollback className='fs-4' />
                            Back User
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

export default EditUser;
