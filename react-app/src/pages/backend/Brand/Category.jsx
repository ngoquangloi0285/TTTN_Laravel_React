import React, { useEffect, useState, useMemo } from 'react';
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


export default function DataGridDemo() {
  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        align: 'center'
      },
      {
        field: 'category_id',
        headerName: 'Category Code',
        editable: true,
        width: 200, // Thêm thuộc tính width vào đây
        align: 'center'
      },
      {
        field: 'name_category',
        headerName: 'Name',
        editable: true,
        width: 100, // Thêm thuộc tính width vào đây
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
            src={`http://localhost:8000/storage/images/${params.value}`}
            alt={params.row.name_category}
            style={{ width: '100%', height: 'auto' }} // Thêm CSS cho hình ảnh
          />
        ),
      },
      {
        field: 'parent_category',
        headerName: 'Parent category',
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
              to={`edit/${params.id}`}
            >
              <GrEdit />
            </Link>
            <span
              className='text-danger mx-1'
              style={{ fontSize: '20px', cursor: 'pointer' }}
              title='Delete'
              onClick={() => handleDelete(params.id)}
            >
              <BsFillTrashFill />
            </span>
          </>
        ),
      },
    ]
  )

  // xử lý hiện modal chi tiết sản phẩm
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (product) => {
    setSelectedCategory(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [countTrash, setCountTrash] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/category/v1/category');
      setRecords(response.data);
      setInitialData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/category/v1/trash');
      setCountTrash(response.data.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/category/v1/soft-delete/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.message.includes('products')) {
        toast.success('Category and its products have been softly deleted.');
      } else {
        toast.success('Category has been softly deleted.');
      }
      updateData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category or its products.');
    }
  };


  const updateData = async () => {
    try {
      const [productsResponse, trashResponse] = await Promise.all([
        axios.get('/api/category/v1/category'),
        axios.get('/api/category/v1/trash')
      ]);
      setRecords(productsResponse.data);
      setInitialData(productsResponse.data);
      setCountTrash(trashResponse.data.length);
    } catch (error) {
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
        record.name_category.toLowerCase().includes(value.toLowerCase())
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
      <Meta title={"Category"} />
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
            placeholder="Search Category..."
            onChange={handleFilter}
          />
          <div className="col-3">
            <Link to="create-category" className="btn btn-info mb-3 text-white d-flex align-items-center" type="button">
              <IoCreateOutline className='fs-4' /> Add New Category
            </Link>
          </div>
          <div className="col-3 d-flex">
            <Link to="trash-category" className="btn btn-danger mb-3 text-white d-flex align-items-center" type="button">
              <FiTrash2 className='fs-4' /> Trash <span>( {!countTrash ? "0" : countTrash} )</span>
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
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
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
            <DialogTitle>Category Detail</DialogTitle>
            <DialogContent className="dialog-content">
              {selectedCategory && (
                <>
                  <Typography className="product-name" variant="h6">{selectedCategory.name_category}</Typography>
                  <Typography className="product-info">{`Category: ${selectedCategory.category_id}`}</Typography>
                  <Typography className="product-info">{`Parent: ${selectedCategory.parent_category}`}</Typography>
                  <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedCategory.detail) }} />
                  <img className="product-image" src={`http://localhost:8000/storage/images/${selectedCategory.image}`} alt={selectedCategory.images} />
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