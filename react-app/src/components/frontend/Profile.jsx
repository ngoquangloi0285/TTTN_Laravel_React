import React, { useCallback, useState } from 'react'
import useAuthContext from '../../context/AuthContext';
import Maps from './Maps';
import { GrEdit } from 'react-icons/gr';
import axios from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineClear } from 'react-icons/ai';
import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    const { currentUser, logout } = useAuthContext();
    const encodedId = currentUser?.id === undefined ? "" : currentUser.id;
    const [isPhoneEditing, setPhoneIsEditing] = useState(false);
    const [isAddressEditing, setAddressIsEditing] = useState(false);
    const [address, setAddress] = useState(currentUser?.address || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
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

    const handleEditPhoneClick = () => {
        setPhoneIsEditing(true);
    };
    const handleEditAddressClick = () => {
        setAddressIsEditing(true);
    };
    const handleCancel = () => {
        setPhoneIsEditing(false);
        setAddressIsEditing(false);
    }

    const handlePhoneSaveClick = async () => {
        const newErrors = {};
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại.";
        }
        if (isNaN(phone)) {
            newErrors.phone = "Số điện thoại phải là số.";
        }
        else if (phone.length !== 10 && phone.length !== 11) {
            newErrors.phone = "Số điện thoại phải có 10 hoặc 11 chữ số.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('phone', phone);
        console.log(formData)
        try {
            // Gọi API để cập nhật địa chỉ
            const res = await axios.post(`/api/user/v1/profile-user/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                toast.success(res.data.message);
            }
            // Dừng chế độ chỉnh sửa
            handleCancel();
        } catch (error) {
            // Xử lý lỗi nếu cần thiết
            console.error(error);
        }
    };

    const handleAddressSaveClick = async () => {
        const newErrors = {};
        if (!address) {
            newErrors.address = "Vui lòng nhập địa chỉ hiện tại của bạn.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('address', address);
        console.log(formData.address)
        try {
            // Gọi API để cập nhật địa chỉ
            const res = await axios.post(`/api/user/v1/profile-user/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                toast.success(res.data.message);
            }
            // Dừng chế độ chỉnh sửa
            handleCancel();
        } catch (error) {
            // Xử lý lỗi nếu cần thiết
            console.error(error);
        }
    }
    const ClearUp = (e) => {
        document.getElementById("file").value = "";
        clearImageUrls();
    }
    const handleAvatar = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (files.length > 1) {
            newErrors.files = "Chỉ được phép tải lên 1 tập tin.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                setErrors("");
            }, 10000); // Hiển thị thông báo lỗi trong 10 giây
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        files.forEach(file => formData.append('images[]', file));
        console.log(formData)
        try {
            // Gọi API để cập nhật địa chỉ
            const res = await axios.post(`/api/user/v1/profile-user/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                toast.success(res.data.message);
            }
            // Dừng chế độ chỉnh sửa
            ClearUp();
        } catch (error) {
            // Xử lý lỗi nếu cần thiết
            console.error(error);
            if (error.status === 500) {
                toast.error(error.data.message);
            }
        }
    }


    const handleDeleteAccount = useCallback(async (id, navigate) => {
        try {
            const response = await axios.delete(`/api/user/v1/soft-delete/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message.includes('products')) {
                Swal.fire(
                    'Delete User Successfully',
                    response.data.message,
                    'success'
                );
            } else {
                Swal.fire(
                    'Delete User Successfully',
                    response.data.message,
                    'success'
                );
            }

            // Trở về trang đăng nhập sau khi xóa thành công
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete user');
        }
    }, []);

    const confirmDelete = useCallback((id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn sẽ xóa người dùng này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteAccount(id, navigate);
            }
        });
    }, [handleDeleteAccount, navigate]);


    return (
        <>
            <ToastContainer />
            <section style={{ backgroundColor: '#eee' }}>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <h5>Ảnh đại diện</h5>

                                    {!currentUser ?
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{ width: 150 }} /> :
                                        <img src={`http://localhost:8000/storage/user/${!currentUser ? "" : currentUser.avatar}`} alt={!currentUser ? "" : currentUser.avatar} className="rounded-circle img-fluid" style={{ width: 150 }} />
                                    }
                                    <br />
                                    <br />
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
                                    <br />
                                    <div className="row d-flex justify-content-center">
                                        {renderPreview()}
                                    </div>
                                    <br />
                                    <button type='submit' onClick={handleAvatar} className='btn text-white bg-primary'>Cập nhật ảnh đại diện</button>
                                    <div className="row d-flex justify-content-center">
                                        {
                                            files.length > 0 &&
                                            <div className="col-6">
                                                <button className='btn text-danger' onClick={ClearUpPhotos}>Xóa ảnh
                                                    <AiOutlineClear className='fs-4 my-2' />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{ width: 150 }} /> */}
                                    <h5 className="my-3"><strong>{!currentUser ? "Đang cập nhật..." : currentUser.name}</strong></h5>
                                    {/* <p className="text-muted mb-4">{user?.address === null ? "Đang cập nhật......" : user.address}</p> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Tên người dùng</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>
                                                <p className="text-muted mb-0">{!currentUser ? "Đang cập nhật......" : currentUser.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Giới tính</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>
                                                <p className="text-muted mb-0">{!currentUser ? "Đang cập nhật......" : currentUser.gender}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>
                                                <p className="text-muted mb-0">{!currentUser ? "Đang cập nhật......" : currentUser.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">

                                        <div className="col-sm-3">
                                            <p className="mb-0">Số điện thoại</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {isPhoneEditing ? (
                                                <div>
                                                    <input
                                                        className='form-control'
                                                        type="text"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                    <div className='mt-2'>
                                                        <button type="button" class="btn btn-primary" onClick={handlePhoneSaveClick}>Save</button>
                                                        <button type="button" class="btn btn-outline-danger ms-1" onClick={handleCancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='d-flex'>
                                                    {/* <p className="text-muted mb-0">{currentUser?.address === null ? "Đang cập nhật......" : currentUser.address} <span onClick={handleEditClick}><GrEdit /></span></p> */}
                                                    <p className="text-muted mb-0 ">(+84) {!currentUser ? "Đang cập nhật......" : currentUser.phone} </p>
                                                    <span className='mx-2' onClick={handleEditPhoneClick}><GrEdit /></span>
                                                </div>
                                            )}
                                            {errors.phone && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Địa chỉ</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {isAddressEditing ? (
                                                <div>
                                                    <input
                                                        id="currentLocationInput" readonly
                                                        className='form-control'
                                                        type="text"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                    <div className='mt-2'>
                                                        <button type="button" class="btn btn-primary" onClick={handleAddressSaveClick}>Save</button>
                                                        <button type="button" class="btn btn-outline-danger ms-1" onClick={handleCancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='d-flex'>
                                                    <p className="text-muted mb-0">
                                                        {!currentUser ? "Đang cập nhật......" : currentUser.address}
                                                    </p>
                                                    <span className='mx-2' onClick={handleEditAddressClick}><GrEdit /></span>
                                                </div>
                                            )}
                                            {errors.address && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errors.address}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <button onClick={() => confirmDelete(encodedId)} className="btn bg-danger text-white mt-5">Xóa tài khoản</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Profile