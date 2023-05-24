import React, { useState } from 'react'
import useAuthContext from '../../context/AuthContext';
import Maps from './Maps';
import { GrEdit } from 'react-icons/gr';
import axios from '../../api/axios';
import { Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const { currentUser, setUserData } = useAuthContext();
    const encodedId = currentUser?.id === undefined ? null : currentUser.id;
    const [isPhoneEditing, setPhoneIsEditing] = useState(false);
    const [isAddressEditing, setAddressIsEditing] = useState(false);
    const [address, setAddress] = useState(currentUser?.address || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

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
            newErrors.phone = "Please enter the phone number.";
        }
        if (isNaN(phone)) {
            newErrors.phone = "Phone number must be a number.";
        }
        else if (phone.length !== 10 && phone.length !== 11) {
            newErrors.phone = "Phone number must be 10 or 11 digits.";
        }
        if (!address) {
            newErrors.address = "Please enter the phone number.";
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
                setMessage(res.data.message)
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
        const formData = new FormData();
        formData.append('address', address);

        try {
            // Gọi API để cập nhật địa chỉ
            await axios.post(`/api/user/v1/profile-user/${encodedId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Dừng chế độ chỉnh sửa
            handleCancel();
        } catch (error) {
            // Xử lý lỗi nếu cần thiết
            console.error(error);
        }
    }

    return (
        <>
            <ToastContainer />
            <section style={{ backgroundColor: '#eee' }}>
                <div className="container py-5">
                    <div className="row">
                        <div className="col">
                            <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
                                <ol className="breadcrumb mb-0">
                                    <Maps title="Profile" />
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    {!currentUser.avatar ?
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{ width: 150 }} /> :
                                        <img src={`http://localhost:8000/storage/user/${currentUser.avatar}`} alt={currentUser.avatar} className="rounded-circle img-fluid" style={{ width: 150 }} />
                                    }
                                    {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar" className="rounded-circle img-fluid" style={{ width: 150 }} /> */}
                                    <h5 className="my-3">{currentUser?.name === null ? "Updating..." : currentUser.name}</h5>
                                    {/* <p className="text-muted mb-4">{user?.address === null ? "Updating..." : user.address}</p> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Full Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <div>
                                                <p className="text-muted mb-0">{currentUser?.name === null ? "Updating..." : currentUser.name}</p>
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
                                                <p className="text-muted mb-0">{currentUser?.email === null ? "Updating..." : currentUser.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">

                                        <div className="col-sm-3">
                                            <p className="mb-0">Phone</p>
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
                                                    {/* <p className="text-muted mb-0">{currentUser?.address === null ? "Updating..." : currentUser.address} <span onClick={handleEditClick}><GrEdit /></span></p> */}
                                                    <p className="text-muted mb-0 ">(+84) {currentUser?.phone === null ? "Updating..." : currentUser.phone} </p>
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
                                        <p className="text-info mb-2"><i>*Use this address to order</i></p>
                                        <div className="col-sm-3">
                                            <p className="mb-0">Order Address</p>
                                        </div>
                                        <div className="col-sm-9">
                                            {isAddressEditing ? (
                                                <div>
                                                    <input
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
                                                        {currentUser?.address === null ? "Updating..." : currentUser.address}
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