import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import LoadingOverlay from 'react-loading-overlay';
import axios from '../../../api/axios';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import useAuthContext from '../../../context/AuthContext';
import NewProduct from './NewProduct';
import { IoCreateOutline } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProduct from './EditProduct';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Meta from '../../../components/frontend/Meta';
import LRU from 'lru-cache';


const Product = () => {
  const cache = new LRU({ max: 100 }); // Lưu trữ tối đa 100 giá trị

  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const [showForm, setShowForm] = useState(false);

  // useMemo() để tạo ra một mảng các đối tượng đại diện cho các cột của bảng dữ liệu.
  const columns = useMemo(
    () => [
      {
        name: 'ID',
        selector: 'id',
        sortable: true,
        center: true,
        style: { fontWeight: 'bold', fontSize: '16px' } //Thêm CSS cho tiêu đề
      },
      {
        name: 'product_id',
        selector: 'product_id',
        sortable: true,
        center: true,
      },
      {
        name: 'Name',
        selector: 'name_product',
        sortable: true,
        center: true,
      },
      {
        name: 'Image',
        selector: 'images',
        center: true,
        cell: row => <img className='img img-fluid img-thumbnail' src={`http://localhost:8000/storage/images/${row.images}`} alt={row.name_product} />, sortable: false,
      },
      {
        name: 'Price',
        selector: 'price',
        sortable: true,
        center: true,
        format: row => `$${row.price}`,
      },
      {
        name: 'Cost',
        selector: 'cost',
        sortable: true,
        center: true,
        format: row => `$${row.cost}`,
      },
      {
        name: 'Discount',
        selector: 'discount',
        sortable: true,
        center: true,
        format: row => `$${row.discount}`,
      },
      {
        name: 'Total',
        selector: 'total',
        sortable: true,
        center: true,
      },
      {
        name: 'Author',
        selector: 'author',
        sortable: true,
        center: true,
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: true,
        center: true,
        format: row => (row.status 
          ? <div style={{ backgroundColor: 'green', padding: '5px', color: 'white', borderRadius
        : '5px' }}>Active</div>
          : <div style={{ backgroundColor: 'red', padding: '5px', color: 'white', borderRadius
        : '5px' }}>Inactive</div>
        ),
      },      
      {
        name: "Actions",
        selector: 'actions',
        center: true,
        cell: row => (
          <>
            <div>
              <span
                className='text-dark mx-1'
                style={{ fontSize: '20px', cursor: 'pointer' }}
                onClick={() => handleEdit(row.id)}
              >
                <AiFillEdit />
              </span>
              <span
                className='text-danger mx-1'
                style={{ fontSize: '20px', cursor: 'pointer' }}
                onClick={() => handleDelete(row.id)}
              >
                <BsFillTrashFill />
              </span>
            </div>
          </>
        )
      }
    ],
    []
  );

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

  const LoadPage = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-loadpage');
    btn.innerHTML = "Loading page...";
    await fetchData();
    btn.innerHTML = "Load page";
  }


  return (
    <>
      <Meta title={"Product"} />
      <div className="product-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <p className='text-danger'>Hello, {user?.name}! You are working on Dashboard
              <br />and
              access will be recorded
            </p>
            <h1 className='text-center text-dark mb-4'>Product Dashboard</h1>
            <Outlet />
            <div style={{
              display: 'flex',
              flex: 1,
              maxWidth: '30%',
            }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Product..."
                onChange={handleFilter}
              />
            </div>
            <div style={{
              display: 'flex',
              flex: 1,
              maxWidth: '30%',
            }}>
              <div className='position-relative'>
                <Link to="new" className="btn btn-info text-white mx-2 d-flex align-items-center" type="button">
                  <IoCreateOutline className='fs-4' /> Add New Product
                </Link>
                {/* <div className="collapse collapse-horizontal-product1 position-absolute z-2" id="collapseWidthExample">
                  <div className="card card-body "
                    style={
                      {
                        minWidth: '1400px',
                        minHeight: '600px',
                      }
                    }>
                    <div className="p-2 text-dark">
                      <NewProduct />
                    </div>
                  </div>
                </div> */}
              </div>
              <button type="button" className="btn btn-danger">
                Trash <span>(0)</span>
              </button>
            </div>
            <LoadingOverlay className='text-danger'
              spinner
              active={isLoading}
              text={<button type='submit' className='button btn-login text-white bg-dark'>Loading data...</button>
              }
            ></LoadingOverlay>
            <DataTable
              columns={columns}
              data={records}
              selectableRows
              fixedHeader
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              className=''
            />
          </div>
          {
            initialData &&
            <button type="button" id='btn-loadpage' onClick={LoadPage} className="btn btn-dark">
              Load page
            </button>
          }
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Product;
