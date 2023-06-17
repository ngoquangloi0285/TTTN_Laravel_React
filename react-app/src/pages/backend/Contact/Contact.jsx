import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { BsFillTrashFill } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { IoCreateOutline } from 'react-icons/io5';
import { FiTrash2 } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';

import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import Meta from '../../../components/frontend/Meta';
import Swal from 'sweetalert2';

function CellRenderer(props) {
  const { value, endpoint, fieldName } = props;
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get(endpoint + `?id=${value}`)
      .then(response => {
        const res = response.data
        setData(res[fieldName])
      })
      .catch(error => {
        console.log(error);
      });
  }, [value, fieldName, endpoint]);

  return <span>{data}</span>;
}


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
        width: 150,
      },
      {
        field: 'email_contact',
        headerName: 'Email',
        editable: true,
        width: 200,
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
        width: 150,
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
            <span
              className='text-danger mx-1'
              style={{ fontSize: '20px', cursor: 'pointer' }}
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

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [countTrash, setCountTrash] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/contact/v1/contacts');
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
      const response = await axios.get('/api/contact/v1/contact/trash');
      setCountTrash(response.data.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      const res = await axios.delete(`/api/contact/v1/soft-delete/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Swal.fire(
        'Delete Contact Successfully',
        res.data.message,
        'success'
      )
      updateData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete Contact.');
    }
  }, []);
  /// xác nhận xóa tạm
  const confirmDelete = useCallback((id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete this contact!',
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

  const updateData = async () => {
    try {
      const [productsResponse, trashResponse] = await Promise.all([
        axios.get('/api/contact/v1/contacts'),
        axios.get('/api/contact/v1/contact/trash')
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
        record.name_contact.toLowerCase().includes(value.toLowerCase())
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

  // xóa tạm nhiều sản phẩm
  const [arrDmr, setArrDmr] = useState([])
  const handleDeleteAll = useCallback(async () => {
    try {
      const res = await axios.delete(`/api/contact/v1/contact_all/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ ids: arrDmr })
      });
      Swal.fire(
        'Delete Contact Successfully',
        res.data.message,
        'success'
      )
      setArrDmr([]);
      updateData();
    } catch (error) {
      console.error(error);
      // toast.error('Failed to delete Contact.');
      Swal.fire(
        'Delete Contact Successfully',
        error.data.message,
        'success'
      )
    }
  }, [arrDmr])
  /// xác nhận xóa tạm
  const confirmDeleteALL = useCallback(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete all Contact!',
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
      <Meta title={"Contact"} />
      <div className="container-xxl">
        <div className="row">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Search Contact..."
            onChange={handleFilter}
          />
          <div className="col-3 d-flex">
            <Link to="trash-contact" className="btn btn-danger mb-3 text-white d-flex align-items-center" type="button">
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