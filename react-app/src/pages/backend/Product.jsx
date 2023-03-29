import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import LoadingOverlay from 'react-loading-overlay';
import axios from '../../api/axios';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoAddSharp } from 'react-icons/io5';
import { FaTrashRestoreAlt } from 'react-icons/fa';
import useAuthContext from '../../context/AuthContext';

const Product = () => {
  const [records, setRecords] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

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
        cell: row => <img className='img img-fluid' src={row.images} alt={row.name_product} />,
        sortable: false,
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
              <span className='text-warning mx-1'
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

  return (
    <>
      <div className="product-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <p className='text-danger'>Hello, {user?.name}! You are working on Dashboard
               <br/>and
              Access will be recorded
            </p>
            <h1 className='text-center text-dark my-3'>Product Dashboard</h1>
            <div
              style={{
                display: 'flex',
                flex: 1,
                maxWidth: '30%',
              }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search Product..."
                onChange={handleFilter}
              />
            </div>
            <div
              className='d-flex align-items-center'
              style={{
                display: 'flex',
                flex: 1,
                maxWidth: '30%',
              }}

            >
              <p className='text-dark my-0'>Actions:</p>
              <span className='text-success'
                style={
                  {
                    fontSize: '27px',
                    cursor: 'pointer',
                    marginBottom: '5px',
                  }
                }
              ><IoAddSharp /></span>
              <span className='text-danger'
                style={
                  {
                    fontSize: '23px',
                    cursor: 'pointer',
                    marginBottom: '5px',
                  }
                }
              ><FaTrashRestoreAlt /></span>
              <span className='text-danger'
                style={
                  {
                    fontSize: '30px',
                    cursor: 'pointer',
                    marginBottom: '5px',
                  }
                }
              ><AiFillDelete /></span>
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
