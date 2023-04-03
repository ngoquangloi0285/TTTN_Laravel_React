import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import LoadingOverlay from 'react-loading-overlay';
import axios from '../../../api/axios';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import useAuthContext from '../../../context/AuthContext';
import NewProduct from './NewProduct';
import { IoCreateOutline } from 'react-icons/io5';


const Product = () => {
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
      },
      {
        name: 'Product Name',
        selector: 'name_product',
        sortable: true,
      },
      {
        name: 'Image',
        selector: 'images',
        cell: row => <img className='img img-fluid img-thumbnail'  src={`http://localhost:8000/images/${row.images}`} alt={row.name_product} />,        sortable: false,
      },
      {
        name: 'Price',
        selector: 'price',
        sortable: true,
        format: row => `$${row.price}`,
      },
      {
        name: 'Cost',
        selector: 'cost',
        sortable: true,
        format: row => `$${row.cost}`,
      },
      {
        name: 'Discount',
        selector: 'discount',
        sortable: true,
        format: row => `$${row.discount}`,
      },
      {
        name: 'Total',
        selector: 'total',
        sortable: true,
      },
      {
        name: 'Author',
        selector: 'author',
        sortable: true,
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: true,
        format: row => (row.status ? 'Active' : 'Inactive'),
      },
      {
        name: "Actions",
        selector: 'actions',
        cell: row => (
          <>
            <div>
              {/* <span className='text-info mx-1'
                style={
                  {
                    fontSize: '20px',
                    cursor: 'pointer'
                  }
                }
              ><AiFillEye /></span> */}
              <span className='text-dark mx-1'
                style={
                  {
                    fontSize: '20px',
                    cursor: 'pointer'
                  }
                }
              ><AiFillEdit /></span>
              <span className='text-danger mx-1'
                style={
                  {
                    fontSize: '20px',
                    cursor: 'pointer'
                  }
                }
              ><BsFillTrashFill /></span>
            </div>
            {/* <button onClick={() => handleEdit(row.id)}>Edit</button>
            <button onClick={() => handleRestore(row.id)}>Restore</button>
            <button onClick={() => handleDelete(row.id)}>Delete</button>
            <button onClick={() => handlePermanentDelete(row.id)}>Permanent Delete</button> */}
          </>
        )
      }
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/v1/products');
        setIsLoading(false);
        setRecords(response.data);
        setInitialData(response.data);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
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
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <div className="product-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <p className='text-danger'>Hello, {user?.name}! You are working on Dashboard
              <br />and
              access will be recorded
            </p>
            <h1 className='text-center text-dark mb-4'>Product Dashboard</h1>
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
                <button className="btn btn-info text-white mx-2 d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
                <IoCreateOutline className='fs-4'/> Add New Product
                </button>
                <div className="collapse collapse-horizontal-product position-absolute z-2" id="collapseWidthExample">
                  <div className="card card-body "
                    style={
                      {
                        minWidth: '1400px',
                        minHeight: '600px',
                      }
                    }>
                    <div className="p-2 text-dark">
                      <NewProduct/>
                    </div>
                  </div>
                </div>
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
