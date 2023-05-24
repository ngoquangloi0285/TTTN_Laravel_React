// globalState.js
let countProduct = [];
let typeProduct = [];
let metaState = '';

export const setProduct = (count) => {
  countProduct = count;
};

export const getProduct = () => {
  return countProduct;
};

export const setMeta = (meta) => {
  metaState = meta;
};

export const getMeta = () => {
  return metaState;
};

export const setType = (type) => {
  typeProduct = type;
};

export const getType = () => {
  return typeProduct;
};
