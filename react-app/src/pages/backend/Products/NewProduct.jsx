import React, { useState } from 'react';
import axios from '../../../api/axios'

function NewProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [detail, setDetail] = useState('');
  function handleSubmit(event) {
    event.preventDefault();

    axios.post('/api/create-product', { name, price, detail })
      .then(response => {
        console.log(response.data)
        if (response.status === 200) {
          console.log("Create Product Success");
        }
      }
      );

  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input className='form-control' type="text" id="name" value={name} onChange={event => setName(event.target.value)} />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input className='form-control' type="text" id="price" value={price} onChange={event => setPrice(event.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Detail:</label>
        <textarea className='form-control' id="description" value={detail} onChange={event => setDetail(event.target.value)} />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}

export default NewProduct;
