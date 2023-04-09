import React, { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import { BsFillTrashFill } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { IoCreateOutline } from 'react-icons/io5';
import { FiTrash2 } from 'react-icons/fi';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';

import LRU from 'lru-cache';
import useAuthContext from '../../../context/AuthContext';


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
        field: 'images',
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
            <span
              className='mx-1'
              style={{ fontSize: '20px', cursor: 'pointer' }}
              title='Edit'
              onClick={() => handleEdit(params.id)}
            >
              <GrEdit />
            </span>
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


  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const { user } = useAuthContext();
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/product/v1/products');
      setIsLoading(false);
      setRecords(response.data);
      setInitialData(response.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleFilter = e => {
    const { value } = e.target;
    setRecords(prevRecords => {
      if (value === '') {
        return [...initialData];
      }
      return prevRecords.filter(record =>
        record.name_product.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  // handle action
  const cache = new LRU({ max: 100 }); // Lưu trữ tối đa 100 giá trị

  const navigate = useNavigate();
  const handleEdit = async (id) => {
    const encodedId = encodeURIComponent(id);
    try {
      let data = cache.get(encodedId); // Kiểm tra cache xem giá trị đã có chưa
      if (!data) {
        const response = await axios.get(`/api/product/v1/products/${encodedId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        data = response.data;
        cache.set(encodedId, data); // Lưu giá trị vào cache
        // console.log("cache:", cache.dump());
      }
      // console.log(data);
      // console.log(`ID của sản phẩm để chỉnh sửa: ${id}`);
      navigate(`edit/${id}`); // chuyển trang và truyền ID theo
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/product/v1/products/${id}/soft-delete`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const products = cache.get('products');
      if (products) {
        // Tìm và cập nhật sản phẩm đã bị xóa trong cache
        const updatedProducts = products.filter((product) => product.id !== id);
        cache.set('products', updatedProducts);
      }
      toast.success('Product has been softly deleted.');
      console.log(`ID của sản phẩm để xóa tạm: ${id}`);
      fetchData(); // Cập nhật lại bảng sản phẩm
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product.');
    }
  };

  const LoadPage = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-loadpage');
    btn.innerHTML = "Loading page...";
    await fetchData();
    btn.innerHTML = "Load page";
  }

  return (
    <>
      <div className="container-xxl">
        <div className="row">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Search Product..."
            onChange={handleFilter}
          />
          <div className="col-3">
            <Link to="new" className="btn btn-info mb-3 text-white d-flex align-items-center" type="button">
              <IoCreateOutline className='fs-4' /> Add New Product
            </Link>
          </div>
          <div className="col-3 d-flex">
            <Link to="new" className="btn btn-danger mb-3 text-white d-flex align-items-center" type="button">
              <FiTrash2 className='fs-4' /> Trash <span>(0)</span>
            </Link>
          </div>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={records}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
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
          <LoadingOverlay className='text-danger'
            spinner
            active={isLoading}
            text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
            }
          ></LoadingOverlay>
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