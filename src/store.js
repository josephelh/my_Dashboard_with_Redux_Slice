import { configureStore, combineReducers } from "@reduxjs/toolkit";
import globalReducer from "state";
import productSlice from "slices/productSlice";
import singleProductSlice from "slices/singleProductSlice";
import userSlice from "slices/userSlice";
import clientSlice from "slices/clientSlice";

const reducers = combineReducers({
  global: globalReducer,
  products : productSlice,
  product : singleProductSlice,
  users : userSlice,
  clients : clientSlice,
 
});

const store = configureStore(
  { reducer: reducers}
  );

export default store;
