import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Toast, Container } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import useAuthContext from '../../../context/AuthContext';
import LoadingOverlay from 'react-loading-overlay';
import { IoCreateOutline } from 'react-icons/io5';
import { AiOutlineClear, AiOutlineRollback } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

const CreateUser = () => {

    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

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
    }

    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

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
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
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
        formData.append('password', password);
        formData.append('status', option_status);
        files.forEach(file => formData.append('images[]', file));

        console.log(formData)
        try {
            btn.innerHTML = "Creating...";
            const response = await axios.post('/api/user/v1/create-user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            btn.innerHTML = "Create New User";
            if (response.status === 200) {
                setStatus(response.data.status)
                // toast.success(response.data.status);
                // Nếu thành công, hiển thị thông báo thành công
                Swal.fire('Create new User successfully!', response.data.message, 'success');
            }
            ClearUp();
        } catch (error) {
            // Xử lý lỗi
            setIsLoading(false);
            if (error.response.data.error === 500) {
                Swal.fire('Error!', error.response.data.error, 'error');
            } else {
                Swal.fire('Error!', 'Please double check the input or maybe this email already exists.', 'error');
            }
            btn.innerHTML = "Create New User";
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
            <Meta title={"Create User"} />
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
                                Create new User
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
                                <label className='form-label fw-bold' htmlFor="password">Password:</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='form-control' id='password' type="password" placeholder='Enter Password' />
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
                </form>
            </div>

        </>
    );
};

export default CreateUser;
