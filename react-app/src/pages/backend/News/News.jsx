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
        field: 'images',
        headerName: 'Image',
        sortable: false,
        cellClassName: 'custom-cell',
        width: 150,
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
        // cellRenderer: params => {
        //   const categoryId = params.value;
        //   const [categoryName, setCategoryName] = useState('');

        //   useEffect(() => {
        //     axios.get(`/api/category/v1/category/${categoryId}`)
        //       .then(response => {
        //         const categoryData = response.data;
        //         setCategoryName(categoryData.name);
        //       })
        //       .catch(error => {
        //         console.log(error);
        //       });
        //   }, [categoryId]);

        //   return <span>{categoryName}</span>;
        // }
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
              style={{ fontSize: '20px', cursor: 'pointer' }}
              title='Edit'
              to={`edit-news/${params.id}`}
            >
              <GrEdit />
            </Link>
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
  const [selectedNews, setSelectedNews] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (news) => {
    setSelectedNews(news);
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
      const response = await axios.get('/api/news/v1/news');
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
      const response = await axios.get('/api/news/v1/trash');
      setCountTrash(response.data.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      const res = await axios.delete(`/api/news/v1/news/${id}/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Swal.fire(
        'Delete News Successfully',
        res.data.message,
        'success'
      )
      updateData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete News.');
    }
  }, []);
  /// xác nhận xóa tạm
  const confirmDelete = useCallback((id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete this catalog and related products!',
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
        axios.get('/api/news/v1/news'),
        axios.get('/api/news/v1/trash')
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

  // xóa tạm nhiều sản phẩm
  const [arrDmr, setArrDmr] = useState([])
  const handleDeleteAll = useCallback(async () => {
    try {
      const res = await axios.delete(`/api/news/v1/news/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ ids: arrDmr })
      });
      Swal.fire(
        'Delete News Successfully',
        res.data.message,
        'success'
      )
      setArrDmr([]);
      updateData();
    } catch (error) {
      console.error(error);
      // toast.error('Failed to delete product.');
      Swal.fire(
        'Delete News Successfully',
        error.data.message,
        'success'
      )
    }
  }, [arrDmr])
  /// xác nhận xóa tạm
  const confirmDeleteALL = useCallback(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to temporarily delete all this catalog and related products!',
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
      <Meta title={"News"} />
      <div className="container-xxl">
        <div className="row">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Search Product..."
            onChange={handleFilter}
          />
          <div className="col-3">
            <Link to="create-news" className="btn btn-info mb-3 text-white d-flex align-items-center" type="button">
              <IoCreateOutline className='fs-4' /> Create new News
            </Link>
          </div>
          <div className="col-3 d-flex">
            <Link to="trash-news" className="btn btn-danger mb-3 text-white d-flex align-items-center" type="button">
              <FiTrash2 className='fs-4' /> Trash <span>( {!countTrash ? "0" : countTrash} )</span>
            </Link>
            {
              arrDmr.length > 1 &&
              <button onClick={confirmDeleteALL} className="btn btn-danger mb-3 mx-2 text-white d-flex align-items-center" type="button">
                <FiTrash2 className='fs-4' /> Delete all
              </button>
            }
          </div>
          {/* hiện data news */}
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
                  <Typography className="product-info">{`Category: ${selectedNews.category_id}`}</Typography>
                  <Typography className="product-title">Detail:</Typography>
                  <Typography className="product-detail" gutterBottom dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNews.content_news) }} />
                  <img className="product-image" src={`http://localhost:8000/storage/news/${selectedNews.image}`} alt={selectedNews.name_product} />
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