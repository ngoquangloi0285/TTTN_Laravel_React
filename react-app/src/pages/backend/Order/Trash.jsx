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
            headerName: 'Mã đơn hàng',
            align: 'center',
          },
    
          {
            field: 'orderer_name',
            headerName: 'Tên khách hàng',
            editable: true,
            width: 150,
            align: 'center',
          },
          {
            field: 'email_order',
            headerName: 'eMail khách hàng',
            editable: true,
            width: 200,
            // align: 'center',
          },
          {
            field: 'total_amount',
            headerName: 'Tổng tiền đơn hàng',
            editable: true,
            width: 150,
            align: 'center',
            valueFormatter: (params) => {
              const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              });
              return formatter.format(params.value);
            }
          },
          {
            field: 'note',
            headerName: 'Lời nhắn khách hàng',
            editable: true,
            width: 250,
            align: 'center',
          },
          {
            field: 'payment_method',
            headerName: 'Phương thức thanh toán',
            editable: true,
            width: 200,
            align: 'center',
          },
          {
            field: 'note_admin',
            headerName: 'Ghi chú',
            editable: true,
            width: 250,
            align: 'center',
          },
          {
            field: 'status',
            headerName: 'Trạng thái đơn hàng',
            width: 220,
            align: 'center',
            renderCell: (params) => {
              const statusStyle = {
                padding: '5px',
                borderRadius: '5px',
                color: 'black',
              };
              let statusText, backgroundColor;
              switch (params.value) {
                case 0:
                  statusText = 'Đang đợi xác nhận...';
                  backgroundColor = 'yellow';
                  break;
                case 1:
                  statusText = 'Đang đợi đóng gói...';
                  backgroundColor = 'green';
                  break;
                case 2:
                  statusText = 'Đang đợi vận chuyển...';
                  backgroundColor = 'pink';
                  break;
                case 3:
                  statusText = 'Đang giao...';
                  backgroundColor = 'orange';
                  break;
                case 4:
                  statusText = 'Đã giao';
                  backgroundColor = 'purple';
                  break;
                default:
                  statusText = 'Không xác định';
                  backgroundColor = 'gray';
              }
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
            headerName: 'Hành động',
            sortable: false,
            align: 'center',
            renderCell: (params) => (
              <>
                <Link
                  className='mx-1 text-info'
                  style={{ fontSize: '25px', cursor: 'pointer' }}
                  title='Edit'
                  to={`../order/view-history/${params.id}`}
                >
                  <AiOutlineEye />
                </Link>
              </>
            ),
          },
        ]
      )


    // xử lý load product
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [countTrash, setCountTrash] = useState(0);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/order/v1/trash');
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

    // lọc sản phẩm theo tên
    const handleFilter = useCallback(e => {
        const { value } = e.target;
        setRecords(prevRecords => {
            if (value === '') {
                return [...initialData];
            }
            return prevRecords.filter(record =>
                record.id.toLowerCase().includes(value.toLowerCase())
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
            <Meta title={"Lịch sử đơn hàng"} />
            <div className="container-xxl">
                <div className="row">
                    <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Tìm kiếm đơn hàng..."
                        onChange={handleFilter}
                    />
                    <div className="col-12 d-flex">
                        {/* <Link className="btn btn-info m-1 text-white d-flex align-items-center" type="button">
                            <FiTrash2 className='fs-4' /> Lịch sử đơn hàng <span>( {!countTrash ? "0" : countTrash} )</span>
                        </Link> */}
                        <Link to='../order' className="btn btn-info m-1 text-white d-flex align-items-center" type="button">
                            <AiOutlineRollback className='fs-4' /> Quay về đơn hàng
                        </Link>

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
                            // Hàm này sẽ được gọi mỗi khi thực hiện tìm kiếm
                            onFilterModelChange={(model) => console.log(model)}
                        />
                    </Box>
                    {/* hiện data product end*/}

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