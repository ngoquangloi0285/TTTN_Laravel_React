import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { BsFillTrashFill } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { IoCreateOutline } from 'react-icons/io5';
import { FiTrash2 } from 'react-icons/fi';
import { AiFillDelete, AiFillEdit, AiFillEye, AiOutlineEye } from 'react-icons/ai';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';

import LRU from 'lru-cache';
import useAuthContext from '../../../context/AuthContext';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
import Meta from '../../../components/frontend/Meta';
import Swal from 'sweetalert2';


export default function DataGridDemo() {
  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        align: 'center'
      },
      {
        field: 'brand_id',
        headerName: 'Brand Code',
        editable: true,
        width: 150, // Thêm thuộc tính width vào đây
        align: 'center'
      },
      {
        field: 'name',
        headerName: 'Name',
        editable: true,
        width: 150, // Thêm thuộc tính width vào đây
        align: 'center'
      },
      {
        field: 'image',
        headerName: 'Image',
        sortable: false,
        cellClassName: 'custom-cell',
        width: 100, // Thêm thuộc tính width vào đây
        align: 'center',
        renderCell: (params) => (
          <img
            className='img img-fluid img-thumbnail'
            src={`http://localhost:8000/storage/brand/${params.value}`}
            alt={params.row.name_category}
            style={{ width: '100%', height: 'auto' }} // Thêm CSS cho hình ảnh
          />
        ),
      },
      {
        field: 'parent_brand',
        headerName: 'Parent Brand',
        type: 'number',
        editable: true,
        width: 150, // Thêm thuộc tính width vào đây
        align: 'center',
        valueFormatter: (params) => {
          if (params.value === 0) {
            return 'Level 1';
          } else if (params.value === 1) {
            return 'Level 2';
          } else {
            return `${params.value}`;
          }
        },
      },
      {
        field: 'detail', headerName: 'Detail',
        width: 100, // Thêm thuộc tính width vào đây
        align: 'center',
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
        width: 100, // Thêm thuộc tính width vào đây
        align: 'center',
        editable: true,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100, // Thêm thuộc tính width vào đây
        align: 'center',
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
        width: 100, // Thêm thuộc tính width vào đây
        align: 'center',
        renderCell: (params) => (
          <>
            <Link
              className='mx-1'
              style={{ fontSize: '20px', cursor: 'pointer' }}
              title='Edit'
              to={`edit-brand/${params.id}`}
            >
              <GrEdit />
            </Link>
            <span
              className='text-danger mx-1'
              style={{ fontSize: '20px', cursor: 'pointer' }}
              title='Delete'
              onClick={() => confirmRestore(params.id)}
            >
              <BsFillTrashFill />
            </span>
          </>
        ),
      },
    ]
  )

  // xử lý hiện modal chi tiết sản phẩm
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (brand) => {
    setSelectedBrand(brand);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [countTrash, setCountTrash] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/brand/v1/brand');
      setRecords(response.data);
      setInitialData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchTrash = async () => {
    try {
      const response = await axios.get('/api/brand/v1/trash');
      setCountTrash(response.data.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await axios.delete(`/api/brand/v1/soft-delete/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setIsLoading(false);
      if (response.data.message.includes('products')) {
        // toast.success('Category and its products have been softly deleted.');
        Swal.fire(
          'Delete Category Successfully',
          response.data.message,
          'success'
        )
      } else {
        // toast.success('Category has been softly deleted.');
        Swal.fire(
          'Delete Category Successfully',
          response.data.message,
          'success'
        )
      }
      updateData();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error('Failed to delete category or its products.');
    }
  }, []);
  /// xác nhận xóa tạm
  const confirmRestore = useCallback((id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete this brand and related products!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
        updateData();
      }
    });
  }, [handleDelete]);

  const updateData = async () => {
    try {
      const [brandResponse, trashResponse] = await Promise.all([
        axios.get('/api/brand/v1/brand'),
        axios.get('/api/brand/v1/trash')
      ]);
      setIsLoading(false);
      setRecords(brandResponse.data);
      setInitialData(brandResponse.data);
      setCountTrash(trashResponse.data.length);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleFilter = e => {
    const { value } = e.target;
    setRecords(prevRecords => {
      // nếu thanh search không có dữ liệu thì tự động load lại danh sách
      if (value === '') {
        return [...initialData];
      }
      return prevRecords.filter(record =>
        record.name.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const LoadPage = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-loadpage');
    btn.innerHTML = "Loading page...";
    await fetchData();
    btn.innerHTML = "Load page";
  };

  useEffect(() => {
    fetchData();
    fetchTrash();
  }, []);
  // xóa tạm nhiều sản phẩm
  const [arrDmr, setArrDmr] = useState([])
  const handleDeleteAll = useCallback(async () => {
    try {
      const res = await axios.delete(`/api/brand/v1/brand_all/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ ids: arrDmr })
      });
      Swal.fire(
        'Delete Brand Successfully',
        res.data.message,
        'success'
      )
      setArrDmr('');
      updateData();
    } catch (error) {
      console.error(error);
      // toast.error('Failed to delete product.');
      Swal.fire(
        'Delete Brand Successfully',
        error.data.message,
        'success'
      )
    }
  }, [arrDmr])

  /// xác nhận xóa tạm
  const confirmDeleteALL = useCallback(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete all this brand and related products!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteAll();
      }
    });
  }, [handleDeleteAll]);
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
      <Meta title={"Brand"} />
      <LoadingOverlay className='text-danger'
        spinner
        active={isLoading}
        text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
        }
      ></LoadingOverlay>
      <div className="container-xxl">
        <div className="row">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Search Brand..."
            onChange={handleFilter}
          />
          <div className="col-3">
            <Link to="create-brand" className="btn btn-info mb-3 text-white d-flex align-items-center" type="button">
              <IoCreateOutline className='fs-4' /> Add New Brand
            </Link>
          </div>
          <div className="col-3 d-flex">
            <Link to="trash-brand" className="btn btn-danger mb-3 text-white d-flex align-items-center" type="button">
              <FiTrash2 className='fs-4' /> Trash <span>( {!countTrash ? "0" : countTrash} )</span>
            </Link>
            {
              arrDmr.length > 1 &&
              <button onClick={confirmDeleteALL} className="btn btn-danger mb-3 mx-2 text-white d-flex align-items-center" type="button">
                <FiTrash2 className='fs-4' /> Delete all
              </button>
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
            <DialogTitle>Brand Detail</DialogTitle>
            <DialogContent className="dialog-content">
              {selectedBrand && (
                <>
                  <Typography className="product-name" variant="h6">{selectedBrand.name}</Typography>
                  <Typography className="product-info">{`Brand Code: ${selectedBrand.brand_id}`}</Typography>
                  <Typography className="product-info">{`Parent: ${selectedBrand.parent_brand}`}</Typography>
                  <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedBrand.detail) }} />
                  <img className="product-image" src={`http://localhost:8000/storage/brand/${selectedBrand.image}`} alt={selectedBrand.image} />
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