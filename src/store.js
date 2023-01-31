import { configureStore, combineReducers } from "@reduxjs/toolkit";
import globalReducer from "state";
import productSlice from "slices/productSlice";
import singleProductSlice from "slices/singleProductSlice";
import userSlice from "slices/userSlice";
import clientSlice from "slices/clientSlice";
import orderSlice from "slices/orderSlice";

const reducers = combineReducers({
  global: globalReducer,
  products : productSlice,
  product : singleProductSlice,
  users : userSlice,
  clients : clientSlice,
  orders: orderSlice,
 
});

const store = configureStore(
  { reducer: reducers}
  );

export default store;
