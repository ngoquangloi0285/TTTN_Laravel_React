import React, { useState } from 'react';
import axios from '../../../api/axios'

function NewProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [detail, setDetail] = useState('');
  const [status, setStatus] = useState(null);
  const [errors, setError] = useState([]);
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null)
    try {
      const response = await axios.post('/api/v1/create-product', {
        name,
        price,
        detail
      })
      setStatus(response.data.status)
      setPrice("");
      setDetail("");
      setName("");
    } catch (e) {
      if (e.data.status === 500) {
        setError("Loi")
      }
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      {status && <div class="alert alert-success bg-success text-center" role="alert">
        {status}
      </div>}
      <div>
        <label htmlFor="name">Name:</label>
        <input className='form-control' type="text" id="name" value={name} onChange={event => setName(event.target.value)} />
        {errors.name &&
          <div className="d-flex">
            <span className="text-error">{errors.name[0]}</span>
          </div>}
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input className='form-control' type="text" id="price" value={price} onChange={event => setPrice(event.target.value)} />
        {errors.price &&
          <div className="d-flex">
            <span className="text-error">{errors.price[0]}</span>
          </div>}
      </div>
      <div>
        <label htmlFor="description">Detail:</label>
        <textarea className='form-control' id="description" value={detail} onChange={event => setDetail(event.target.value)} />
        {errors.detail &&
          <div className="d-flex">
            <span className="text-error">{errors.detail[0]}</span>
          </div>}
      </div>
      <button type="submit">Create</button>
    </form>
  );
}

export default NewProduct;
