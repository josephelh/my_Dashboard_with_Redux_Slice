import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
  products: [],
  loading: false,
  error: null,
};


const baseurl = process.env.REACT_APP_API_BASE_URL;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',  
    async (params) => {    
    const { page, pageSize,keyword } = params;
    const config = {      
      params: {
        page,
        pageSize,
        keyword
      }
    };

    const response = await axios.get(`${baseurl}/products`,config);      
    return response.data;
  }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: build => {
      build.addCase(fetchProducts.pending, state => {
        state.loading = true;
      });
      build.addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      });
      build.addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
     
    }
  });

  export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsError,   
  } = productSlice.actions;
  
  export default productSlice.reducer



//   const baseurl = 'http://localhost:5001';

// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',  
//     async (keyword ="") => {     
//     const response = await axios.get(`${baseurl}/products?keyword=${keyword}`);      
//     return response.data;
//   }
// );

// const [keyword, setKeyword] = useState("");
// const theme = useTheme();

//   // Search Submit handler
//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (keyword.trim()) {
//       navigate(`/products/search?keyword=${keyword}`);
//     } else {
//       navigate("/products");
//     }
//   };

//   useEffect(() => {
    
//     if (successCreate) {
//       navigate(`/products/newproduct/${createdProductId}`);
//     } else {
//       dispatch(fetchProducts());
//       dispatch(resetSuccessCreate());
//     }
//     if (successDelete) {
//       dispatch(fetchProducts(keyword));
//       dispatch(resetSuccessDelete());
//     }
//   }, [dispatch, navigate, createdProductId, successCreate, successDelete,keyword]);