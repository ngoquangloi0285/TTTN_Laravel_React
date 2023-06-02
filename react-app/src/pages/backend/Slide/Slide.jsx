import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import axios from '../../../api/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';
import Meta from '../../../components/frontend/Meta';
import { Link } from 'react-router-dom';
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
                style={{ width: '24%', height: 'auto', margin: '4px' }}
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
        headerName: 'Status Product',
        width: 120, // Thêm thuộc tính width vào đây
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
        width: 200, // Thêm thuộc tính width vào đây

        renderCell: (params) => (
          <>
            <button onClick={() => confirmCreate(params.id)} type="button" id='create_slide' class="btn btn-primary">Create</button>
            {/* <button onClick={() => handleDeleteSlide(params.id)} type="button" id='delete_slide' class="btn btn-outline-danger ms-1">Delete</button> */}
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

  const handleCreateSlide = useCallback(async (id) => {
    const btn = document.getElementById('create_slide');

    try {
      const product = records.find(product => product.id === id);
      if (!product) {
        console.log("Product not found");
        return;
      }

      const { image, type, slug, name_product, price, discount, images } = product;

      const uniqueImages = [...new Set(images.map(image => image.image))];
      uniqueImages.unshift(image);

      const formData = new FormData();
      formData.append('product_id', id);
      formData.append('type', type);
      formData.append('name_product', name_product);
      formData.append('price', price);
      formData.append('discount', discount ? discount : "");
      formData.append('slug_product', slug);
      uniqueImages.forEach(file => formData.append('images[]', file));
      console.log(formData)
      if (btn) {
        btn.innerHTML = "Creating...";

        const res = await axios.post('/api/slide/v1/create_slide', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.status === 200) {
          toast.success(res.data.status);
        }
        btn.innerHTML = "Create";
        console.log("Slide created successfully");
      }
    } catch (error) {
      console.log("Error creating slide:", error);
      if (error.response.status) {
        toast.error(error.response.data.error);
      }
      btn.innerHTML = "Create";
    }
  }, [records]);

  const confirmCreate = useCallback((id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Tạo và xóa các bảng ghi hiện có!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có tạo và hiện!',
      cancelButtonText: 'Không!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleCreateSlide(id);
      }
    });
  }, [handleCreateSlide]);
  // const handleDeleteSlide = async (id) => {
  //   const btn = document.getElementById('delete_slide');

  //   try {
  //     if (btn) {
  //       btn.innerHTML = "Deleting...";
  //       const res = await axios.delete(`/api/slide/v1/remove/${id}`, {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       if (res.status === 200) {
  //         toast.success(res.data.message);
  //       }
  //       btn.innerHTML = "Delete";
  //       console.log("Slide Deleted successfully");
  //     }
  //   } catch (error) {
  //     console.log("Error deleting slide:", error);
  //     if (error.response.status) {
  //       toast.error(error.response.data.error);
  //     }
  //     btn.innerHTML = "Delete";
  //   }
  // }

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
        <form method="POST" enctype="multipart/form-data">
          <div className="row">
            <div className="col-5 mt-2">
              <p className='mb-0 title-sort d-block'>Type Slide Product:</p>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className='form-control form-select' name="" id="">
                <option value="" selected>Select Filter Slide Product</option>
                {/* <option value="new_product">New Product</option> */}
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
        </form>
      </div>

    </>
  );
}