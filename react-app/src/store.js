import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../src/reducer/reducer';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
