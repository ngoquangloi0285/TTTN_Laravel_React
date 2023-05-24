import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';
import Meta from '../../../components/frontend/Meta';
import { Link } from 'react-router-dom';

export default function DataGridDemo() {
  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        align: 'center'
      },
      {
        field: 'name_product',
        headerName: 'Product Name',
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
            src={`http://localhost:8000/storage/product/${params.value}`}
            alt={params.row.name_category}
            style={{ width: '100%', height: 'auto' }} // Thêm CSS cho hình ảnh
          />
        ),
      },
      {
        field: 'images',
        headerName: 'Images',
        width: 300,
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {params.value.map((image, index) => (
              <img
                className='img img-fluid img-thumbnail'
                key={index}
                src={`http://localhost:8000/storage/product/${image.image}`}
                alt={`Image ${index}`}
                style={{ width: '100%', height: 'auto', margin: '4px' }}
              />
            ))}
          </div>
        ),
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 150, // Thêm thuộc tính width vào đây
        align: 'center',
        editable: true,
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
        width: 150, // Thêm thuộc tính width vào đây

        renderCell: (params) => (
          <>
            <button type="button" class="btn btn-primary">Tạo</button>
            <button type="button" class="btn btn-outline-danger ms-1">Xóa</button>
          </>
        ),
      },
    ]
  )

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/slide/v1/slide', {
          params: {
            filter: filter,
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setRecords(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filter]);


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
      <Meta title={"Slide"} />
      <LoadingOverlay className='text-danger'
        spinner
        active={isLoading}
        text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
        }
      ></LoadingOverlay>
      <div className="container-xxl">
        <div className="row">
          <div className="col-5 mt-2">
            <p className='mb-0 title-sort d-block'>Type Slide Product:</p>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className='form-control form-select' name="" id="">
              <option value="" selected>Select Filter Slide Product</option>
              <option value="new_product">New Product</option>
              <option value="product_sale">Sale Product</option>
              <option value="product_special">Special Product</option>
            </select>
          </div>
        </div>
        <div className="row">
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

              components={{
                Toolbar: GridToolbar,
              }}
              // Hàm này sẽ được gọi mỗi khi thực hiện tìm kiếm
              onFilterModelChange={(model) => console.log(model)}
            />
          </Box>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}