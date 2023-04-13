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
      },
      {
        field: 'product_id',
        headerName: 'Product Code',
        editable: true,
      },
      {
        field: 'name_product',
        headerName: 'Name',
        editable: true,
      },
      {
        field: 'image',
        headerName: 'Image',
        sortable: false,
        cellClassName: 'custom-cell',
        renderCell: (params) => (
          <img
            className='img img-fluid img-thumbnail'
            src={`http://localhost:8000/storage/images/${params.value}`}
            alt={params.row.name_product}
            style={{ width: '100%', height: 'auto' }} // Thêm CSS cho hình ảnh
          />
        ),
      },
      {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        editable: true,
        valueFormatter: (params) => `$${params.value}`,
      },
      {
        field: 'cost',
        headerName: 'Cost',
        type: 'number',
        editable: true,
        valueFormatter: (params) => `$${params.value}`,
      },
      {
        field: 'discount',
        headerName: 'Discount',
        type: 'number',
        editable: true,
        valueFormatter: (params) => `$${params.value}`,
      },
      // {
      //   field: 'total',
      //   headerName: 'Total',
      //   type: 'number',
      //   editable: true,
      // },
      // {
      //   field: 'qrCode',
      //   headerName: 'QR Code',
      //   width: 200,
      //   renderCell: (params) => (
      //     <button onClick={() => setIsModalOpen(true)}>View QR Code</button>
      //   ),
      // },
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
              style={{ fontSize: '20px', cursor: 'pointer' }}
              title='Edit'
              to={`edit-product/${params.id}`}
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
  // Xử lý hiện QR Code 
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [countTrash, setCountTrash] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/product/v1/products');
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
      const response = await axios.get('/api/product/v1/trash');
      setCountTrash(response.data.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/product/v1/products/${id}/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Product has been softly deleted.');
      updateData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product.');
    }
  };

  const updateData = async () => {
    try {
      const [productsResponse, trashResponse] = await Promise.all([
        axios.get('/api/product/v1/products'),
        axios.get('/api/product/v1/trash')
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
        record.name_product.toLowerCase().includes(value.toLowerCase())
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
      <Meta title={"Product"} />
      <div className="container-xxl">
        <div className="row">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Search Product..."
            onChange={handleFilter}
          />
          <div className="col-3">
            <Link to="create-product" className="btn btn-info mb-3 text-white d-flex align-items-center" type="button">
              <IoCreateOutline className='fs-4' /> Add New Product
            </Link>
          </div>
          <div className="col-3 d-flex">
            <Link to="trash-product" className="btn btn-danger mb-3 text-white d-flex align-items-center" type="button">
              <FiTrash2 className='fs-4' /> Trash <span>( {!countTrash ? "0" : countTrash} )</span>
            </Link>
          </div>
          {/* Hiện QR CODE */}
          {/* <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="QR Code Modal"
            style={{ content: { width: '300px', height: '300px' } }}
            className="modal-qrcode"
          >
            <img 
            className='img img-fluid'
              style={{ width: '100%', height: 'auto' }}
              src={`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(
                'qr-code-data'
              )}`}
              alt="QR code"
            />
          </Modal> */}
          {/* Hiện QR CODE END */}

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
            <DialogTitle>Product Detail</DialogTitle>
            <DialogContent className="dialog-content">
              {selectedProduct && (
                <>
                  <Typography className="product-name" variant="h6">{selectedProduct.name_product}</Typography>
                  <Typography className="product-info">{`Category: ${selectedProduct.category_id}`}</Typography>
                  <Typography className="product-info">{`Brand: ${selectedProduct.brand_id}`}</Typography>
                  <Typography className="product-info">{`Summary: ${selectedProduct.summary}`}</Typography>
                  <Typography className="product-info">{`Cost: $${selectedProduct.cost}`}</Typography>
                  <Typography className="product-info">{`Price: $${selectedProduct.price}`}</Typography>
                  <Typography className="product-info">{`Discount: $${selectedProduct.discount}`}</Typography>
                  <Typography className="product-info">{`Color: ${selectedProduct.color}`}</Typography>
                  <Typography className="product-info">{`Inch: ${selectedProduct.inch}`}</Typography>
                  <Typography className="product-title">Detail:</Typography>
                  <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.detail) }} />
                  <img className="product-image" src={`http://localhost:8000/storage/images/${selectedProduct.image}`} alt={selectedProduct.images} />
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