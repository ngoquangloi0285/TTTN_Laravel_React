import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import { BsFillTrashFill } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { IoCreateOutline } from 'react-icons/io5';
import { FiTrash2 } from 'react-icons/fi';
import { AiFillDelete, AiFillEdit, AiFillEye, AiOutlineEye, AiOutlineRollback } from 'react-icons/ai';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';

import LRU from 'lru-cache';
import useAuthContext from '../../../context/AuthContext';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
import Meta from '../../../components/frontend/Meta';
import { MdRestore } from 'react-icons/md';
import Swal from 'sweetalert2';


export default function DataGridDemo() {
    const columns = useMemo(
        () => [
            {
                field: 'id',
                headerName: 'ID',
            },
            {
                field: 'contact_id',
                headerName: 'Contact Code',
                editable: true,
            },
            {
                field: 'name_contact',
                headerName: 'Title Contact',
                editable: true,
            },
            {
                field: 'email_contact',
                headerName: 'Email',
                editable: true,
            },
            {
                field: 'phone_contact',
                headerName: 'Phone',
                editable: true,
            },
            {
                field: 'detail', headerName: 'Detail',
                renderCell: (params) => (
                    <Button className=''
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpen(params.row)}
                    >
                        <AiOutlineEye style={{ height: 'auto', fontSize: '26px', }} className='text-info' />  View
                    </Button>
                ),
            },
            {
                field: 'author',
                headerName: 'Author',
                editable: true,
            },
            {
                field: 'status',
                headerName: 'Status',
                renderCell: (params) => {
                    const statusStyle = {
                        padding: '5px',
                        borderRadius: '5px',
                        color: 'white',
                    };
                    const isActive = params.value;
                    const statusText = isActive ? 'Active' : 'Inactive';
                    const backgroundColor = isActive ? 'green' : 'red';
                    const statusDivStyle = {
                        ...statusStyle,
                        backgroundColor,
                    };
                    return <div style={statusDivStyle}>{statusText}</div>;
                },
                editable: true,
            },
            {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                renderCell: (params) => (
                    <>
                        <Link
                            className='mx-1'
                            style={{ fontSize: '30px', cursor: 'pointer' }}
                            title='Edit'
                            onClick={() => confirmRestore(params.id)}
                        >
                            <MdRestore />
                        </Link>
                        <span
                            className='text-danger mx-1'
                            style={{ fontSize: '25px', cursor: 'pointer' }}
                            title='Delete'
                            onClick={() => confirmDelete(params.id)}
                        >
                            <BsFillTrashFill />
                        </span>
                    </>
                ),
            },
        ]
    )

    // xử lý hiện modal chi tiết sản phẩm
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // xử lý load product
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [countTrash, setCountTrash] = useState(0);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/contact/v1/contact/trash');
            setIsLoading(false);
            setRecords(response.data);
            setInitialData(response.data);
            setCountTrash(response.data.length);
        } catch (error) {
            setIsLoading(false);
            toast.error('Failed to load contact.');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // handle action
    const cache = new LRU({ max: 100 }); // Lưu trữ tối đa 100 giá trị

    const handleRestore = useCallback(async (id) => {
        try {
            const res = await axios.post(`/api/contact/v1/restore/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const contact = cache.get('contact');
            if (contact) {
                // Tìm và cập nhật sản phẩm đã bị xóa trong cache
                const updatedProducts = contact.filter((contact) => contact.id !== id);
                cache.set('contact', updatedProducts);
            }
            // toast.success('Product has been softly deleted.');
            Swal.fire(
                'Restore Contact Successfully',
                res.data.message,
                'success'
            )
            console.log(`ID của sản phẩm để xóa tạm: ${id}`);
            fetchData(); // Cập nhật lại bảng sản phẩm
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete contact.');
        }
    }, [fetchData, cache]);
    // xác nhận khôi phục
    const confirmRestore = useCallback((id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to restore this contact!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, restore it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRestore(id);
            }
        });
    }, [handleRestore]);

    const [arrDmr, setArrDmr] = useState([])
    //Khôi phục nhiều sản phẩm 
    const handleRestoreALL = useCallback(async () => {
        try {
            const res = await axios.post('/api/contact/v1/restoreALL', { ids: arrDmr }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire(
                'Restore Contact Successfully',
                res.data.message,
                'success'
            );
            setArrDmr([]);
            fetchData();
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Restore Contact Failed',
                error.data.message,
                'error'
            );
        }
    }, [arrDmr, fetchData]);

    // xác nhận khôi phục
    const confirmRestoreALL = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to restore all this contacts!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, restore all!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRestoreALL();
            }
        });
    }, [handleRestoreALL]);
    // xóa vĩnh viễn
    const handleDelete = useCallback(async (id) => {
        try {
            const res = await axios.delete(`/api/contact/v1/remove/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const contact = cache.get('contact');
            if (contact) {
                // Tìm và cập nhật sản phẩm đã bị xóa trong cache
                const updatedContact = contact.filter((product) => product.id !== id);
                cache.set('contact', updatedContact);
            }
            Swal.fire(
                'Remove Contact Successfully',
                res.data.message,
                'success'
            )            // Xóa sản phẩm khỏi danh sách hiện tại trong state `records`
            setRecords(prevRecords => {
                return prevRecords.filter((contact) => contact.id !== id);
            });
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete contact.');
        }
    }, [cache, setRecords, fetchData]);
    // xác nhận xóa vĩnh viễn
    const confirmDelete = useCallback((id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to Delete this contact!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id);
            }
        });
    }, [handleDelete]);

    const handleDeleteALL = useCallback(async () => {
        try {
            const res = await axios.delete('/api/contact/v1/removeALL', {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ids: arrDmr }
            });
            Swal.fire(
                'Delete all Contact Successfully',
                res.data.message,
                'success'
            );
            setArrDmr([]);
            fetchData();
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Delete all Contact Failed',
                error.data.message,
                'error'
            );
        }
    }, [arrDmr, fetchData]);

    // xác nhận xóa vĩnh viễn nhiều sản phẩm
    const confirmDeleteALL = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to Delete all this Contact!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete all!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteALL();
            }
        });
    }, [handleDeleteALL]);
    // lọc sản phẩm theo tên
    const handleFilter = useCallback(e => {
        const { value } = e.target;
        setRecords(prevRecords => {
            if (value === '') {
                return [...initialData];
            }
            return prevRecords.filter(record =>
                record.name_contact.toLowerCase().includes(value.toLowerCase())
            );
        });
    }, [initialData, setRecords]);

    // load lại bảng data product
    const LoadPage = useCallback(async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-loadpage');
        btn.innerHTML = "Loading page...";
        await fetchData();
        btn.innerHTML = "Load page";
    }, [fetchData]);

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
            <Meta title={"Trash Contact"} />
            <div className="container-xxl">
                <div className="row">
                    <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Search Contact..."
                        onChange={handleFilter}
                    />
                    <div className="col-12 d-flex">
                        <Link className="btn btn-danger m-1 text-white d-flex align-items-center" type="button">
                            <FiTrash2 className='fs-4' /> Trash <span>( {!countTrash ? "0" : countTrash} )</span>
                        </Link>
                        <Link to='../contact' className="btn btn-info m-1 text-white d-flex align-items-center" type="button">
                            <AiOutlineRollback className='fs-4' /> Back Contact
                        </Link>
                        {
                            arrDmr.length > 1 &&
                            <>
                                <button onClick={confirmDeleteALL} className="btn btn-danger m-1 text-white d-flex align-items-center" type="button">
                                    <FiTrash2 className='fs-4' /> Remove ALL
                                </button>
                                <button onClick={confirmRestoreALL} className="btn btn-info m-1 text-white d-flex align-items-center" type="button">
                                    <MdRestore className='fs-4' /> Restore ALL
                                </button>
                            </>
                        }

                    </div>
                    {/* hiện data product */}
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={records}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            onRowSelectionModelChange={(data) => {
                                setArrDmr(data)
                            }}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            // Hàm này sẽ được gọi mỗi khi thực hiện tìm kiếm
                            onFilterModelChange={(model) => console.log(model)}
                        />
                    </Box>
                    {/* hiện data product end*/}

                    {/* Hiển thị modal - chi tiết sản phẩm*/}
                    <Dialog open={open} onClose={handleClose} className="dialog" maxWidth="xl" maxHeight="lg">
                        <DialogTitle>Contact Detail</DialogTitle>
                        <DialogContent className="dialog-content">
                            {selectedProduct && (
                                <>
                                    <Typography className="product-name" variant="h6">{selectedProduct.name_contact}</Typography>
                                    <Typography className="product-info">{`Email: ${selectedProduct.email_contact}`}</Typography>
                                    <Typography className="product-info">{`Phone: ${selectedProduct.phone_contact}`}</Typography>
                                    <h5><strong>Comment:</strong></h5>
                                    <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.comments_contact) }} />
                                </>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Hiển thị modal - chi tiết sản phẩm end*/}



                    <div className="col-3">
                        <button type="button" id='btn-loadpage' onClick={LoadPage} className="btn btn-dark">
                            Load page
                        </button>
                    </div>

                    <ToastContainer />
                </div>
            </div>
        </>
    );
}