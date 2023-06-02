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

const NewMenu = () => {
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);

    const [nameMenu, setNameMenu] = useState();
    const [linkMenu, setLinkMenu] = useState();

    const [errors, setErrors] = useState([]);
    const [error, setError] = useState([]);
    const [status, setStatus] = useState(null);
    const [menuList, setMenuList] = useState([]);
    const [menuPosition, setMenuPosition] = useState([]);

    const fetchMenu = async () => {
        await axios.get('api/menu/v1/menus')
            .then(response => {
                setIsLoading(false);
                setMenuList(response.data);
                console.log("menu", response.data)
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const ClearUp = () => {
        setNameMenu("");
        setLinkMenu("")
        document.getElementById("status").value = "";
        document.getElementById("position").value = "";
    }


    // Xử lý khi người dùng ấn nút Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const btn = document.getElementById('btn_create');
        const option_status = document.getElementById('status').value;

        // định nghĩa lỗi
        const newErrors = {};
        if (!nameMenu) {
            newErrors.nameMenu = "Vui lòng nhập tên menu.";
        }
        if (!linkMenu) {
            newErrors.linkMenu = "Vui lòng nhập link menu";
        }
        else if (linkMenu !== linkMenu.toLowerCase()) {
            newErrors.linkMenu = "*Vui lòng không viết Hoa."
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
        formData.append('nameMenu', nameMenu);
        formData.append('linkMenu', linkMenu);
        formData.append('position', menuPosition);
        formData.append('status', option_status);

        console.log(formData)
        try {
            btn.innerHTML = "Creating...";
            const response = await axios.post('/api/menu/v1/create-menu', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            btn.innerHTML = "Create New Menu";
            if (response.status === 200) {
                setStatus(response.data.status)
                // Nếu thành công, hiển thị thông báo thành công
                Swal.fire('Create new Menu successfully!', response.data.message, 'success');
            }
            ClearUp();
            fetchMenu();
        } catch (error) {
            setIsLoading(false);
            // Nếu xảy ra lỗi, hiển thị thông báo lỗi
            if (error.response.status === 500) {
                Swal.fire('Error!', error.response.data.error, 'error');
            } else {
                Swal.fire('Error!', 'Failed to create new Menu.', 'error');
            }
            btn.innerHTML = "Create New Menu";
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
            <Meta title={"Create Menu"} />
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
                                Create new Menu
                            </button>
                            <Link to="../menu" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Back Menu
                            </Link>
                        </div>
                        <div className="col-4">
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="name_category">Name Menu:</label>
                                <input
                                    value={nameMenu}
                                    onChange={(e) => setNameMenu(e.target.value)}
                                    className='form-control' id='name_category' type="text" placeholder='Enter Name Menu' />
                                {errors.nameMenu && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.nameMenu}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className='form-label fw-bold' htmlFor="link_menu">Link Menu:</label>
                                <input
                                    value={linkMenu}
                                    onChange={(e) => setLinkMenu(e.target.value)}
                                    className='form-control' id='link_menu' type="text" placeholder='Enter Link Menu' />
                                {errors.linkMenu && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.linkMenu}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-5">
                            <label className='form-label fw-bold' htmlFor="position">Position Menu:</label>
                            <select className="form-select mb-2" id='position' value={menuPosition} onChange={(e) => setMenuPosition(e.target.value)} aria-label="Default select example">
                                <option value="" selected>Select Position</option>
                                {/* <option value="0">Position Begin</option> */}
                                {menuList.map(menu => {
                                    return menu.link === '/'
                                        ? <option key={menu.id} value={menu.id} disabled>{menu.name}</option>
                                        : <option key={menu.id} value={menu.id}>Before {menu.name}</option>
                                })}
                            </select>
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
                            <Link to="../menu" className="btn btn-info text-white mr-2" type="button">
                                <AiOutlineRollback className='fs-4' />
                                Back Menu
                            </Link>
                            <br />
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

export default NewMenu;
