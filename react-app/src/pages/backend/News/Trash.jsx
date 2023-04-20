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

function CategoryCellRenderer(props) {
    const { value } = props;
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        axios.get(`/api/category/v1/category?id=${value}`)
            .then(response => {
                const res = response.data
                setCategoryName(res.name_category)
            })
            .catch(error => {
                console.log(error);
            });
    }, [value]);

    return <span>{categoryName}</span>;
}

export default function DataGridDemo() {
    const columns = useMemo(
        () => [
            {
                field: 'id',
                headerName: 'ID',
            },
            {
                field: 'news_id',
                headerName: 'News Code',
                editable: true,
            },
            {
                field: 'title_news',
                headerName: 'Title News',
                editable: true,
                width: 150,
            },
            {
                field: 'image',
                headerName: 'Image',
                sortable: false,
                cellClassName: 'custom-cell',
                renderCell: (params) => (
                    <img
                        className='img img-fluid img-thumbnail'
                        src={`http://localhost:8000/storage/news/${params.value}`}
                        alt={params.row.name_product}
                        style={{ width: '100%', height: 'auto' }} // Thêm CSS cho hình ảnh
                    />
                ),
            },
            {
                field: 'category_id',
                headerName: 'Category',
                editable: true,
                renderCell: (params) => <CategoryCellRenderer value={params.value} />
            },
            {
                field: 'content_news',
                headerName: 'Content News',
                width: 150,
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
    const [selectedNews, setSelectedNews] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (product) => {
        setSelectedNews(product);
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
            const response = await axios.get('/api/news/v1/trash');
            setIsLoading(false);
            setRecords(response.data);
            setInitialData(response.data);
            setCountTrash(response.data.length);
        } catch (error) {
            setIsLoading(false);
            toast.error('Failed to load products.');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // handle action
    const cache = new LRU({ max: 100 }); // Lưu trữ tối đa 100 giá trị

    const handleRestore = useCallback(async (id) => {
        try {
            const res = await axios.post(`/api/news/v1/restore/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const news = cache.get('news');
            if (news) {
                // Tìm và cập nhật sản phẩm đã bị xóa trong cache
                const updatedNews = news.filter((product) => product.id !== id);
                cache.set('news', updatedNews);
            }
            // toast.success('Product has been softly deleted.');
            Swal.fire(
                'Restore News Successfully',
                res.data.message,
                'success'
            )
            console.log(`ID của sản phẩm để xóa tạm: ${id}`);
            fetchData(); // Cập nhật lại bảng sản phẩm
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete News.');
        }
    }, [fetchData, cache]);
    // xác nhận khôi phục
    const confirmRestore = useCallback((id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to restore this news!',
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
            const res = await axios.post('/api/news/v1/restoreALL', { ids: arrDmr }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire(
                'Restore News Successfully',
                res.data.message,
                'success'
            );
            setArrDmr([]);
            fetchData();
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Restore News Failed',
                error.data.message,
                'error'
            );
        }
    }, [arrDmr, fetchData]);

    // xác nhận khôi phục
    const confirmRestoreALL = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to restore all this catalog and related products!',
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
            await axios.delete(`/api/news/v1/remove/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const news = cache.get('news');
            if (news) {
                // Tìm và cập nhật sản phẩm đã bị xóa trong cache
                const updatedNews = news.filter((product) => product.id !== id);
                cache.set('news', updatedNews);
            }
            toast.success('News has been softly deleted.');
            // Xóa sản phẩm khỏi danh sách hiện tại trong state `records`
            setRecords(prevRecords => {
                return prevRecords.filter((product) => product.id !== id);
            });
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete news.');
        }
    }, [cache, setRecords, fetchData]);
    // xác nhận xóa vĩnh viễn
    const confirmDelete = useCallback((id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to Delete this news!',
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
            const res = await axios.delete('/api/news/v1/removeALL', {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ids: arrDmr }
            });
            Swal.fire(
                'Delete all News Successfully',
                res.data.message,
                'success'
            );
            setArrDmr([]);
            fetchData();
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Delete all News Failed',
                error.data.message,
                'error'
            );
        }
    }, [arrDmr, fetchData]);

    // xác nhận xóa vĩnh viễn nhiều sản phẩm
    const confirmDeleteALL = useCallback(() => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to Delete all this news!',
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
                record.title_news.toLowerCase().includes(value.toLowerCase())
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
            <Meta title={"Trash News"} />
            <div className="container-xxl">
                <div className="row">
                    <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Search Product..."
                        onChange={handleFilter}
                    />
                    <div className="col-12 d-flex">
                        <Link className="btn btn-danger m-1 text-white d-flex align-items-center" type="button">
                            <FiTrash2 className='fs-4' /> Trash <span>( {!countTrash ? "0" : countTrash} )</span>
                        </Link>
                        <Link to='../news' className="btn btn-info m-1 text-white d-flex align-items-center" type="button">
                            <AiOutlineRollback className='fs-4' /> Back News
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
                        <DialogTitle>News Detail</DialogTitle>
                        <DialogContent className="dialog-content">
                            {selectedNews && (
                                <>
                                    <Typography className="product-name" variant="h6">{selectedNews.title_news}</Typography>
                                    <Typography className="product-info"> Category:
                                        <CategoryCellRenderer value={selectedNews.category_id} />
                                    </Typography>
                                    <Typography className="product-title">Detail:</Typography>
                                    <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNews.content_news) }} />
                                    <img className="product-image" src={`http://localhost:8000/storage/news/${selectedNews.image}`} alt={selectedNews.image} />
                                    {/* ... Hiển thị các thông tin khác của sản phẩm ... */}
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