import React, { useEffect, useState } from "react";
import "./products.css";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Loader from "components/Loader";
import { useNavigate } from "react-router-dom";
import Message from "components/Message";
import { fetchProducts } from "slices/productSlice";
import {
  createProduct,
  deleteProduct,
  resetSuccessCreate,
  resetSuccessDelete,
} from "slices/singleProductSlice";
import { Search } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { Button, IconButton, InputBase, Stack, useTheme } from "@mui/material";

const Products = () => {
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, products } = useSelector((state) => state.products);
  const productCreate = useSelector((state) => state.product);
  const { successCreate, createdProductId } = productCreate;
  const {
    loading: loadingdelete,
    error: errordelete,
    successDelete,
  } = useSelector((state) => state.product);

  useEffect(() => {
    const params = {
      page: page,
      pageSize: pageSize,
      keyword: keyword,
    };
    dispatch(fetchProducts(params));
    if (successCreate) {
      navigate(`/products/newproduct/${createdProductId}`);
    } else {
      dispatch(resetSuccessCreate());
    }
    if (successDelete) {
      dispatch(resetSuccessDelete());
    }
  }, [
    dispatch,
    navigate,
    createdProductId,
    successCreate,
    successDelete,
    keyword,
    page,
    pageSize,    
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("ete vous sur?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  // Search Submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/search?keyword=${keyword}`);
    } else {
      navigate("/products");
    }
  };

  const columns = [
    { field: "_id", hide: true },
    {
      field: "name",
      flex: 2,
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.image} alt="" />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "countInStock", align: "center", headerName: "Stock", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/products/singleproduct/" + params.row._id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteForeverIcon
              className="productListDelete"
              onClick={() => deleteHandler(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div
      style={{
        height: "77vh",
        marginRight: "20px",
        marginLeft: "20px",
        marginTop: "20px",
      }}
    >
      <FlexBetween>
        <Button
          variant="contained"
          color="success"
          style={{
            width: "20%",
            color: "white",
            paddingTop: "10px",
            paddingBottom: "10px",
            marginTop: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
          onClick={createProductHandler}
        >
          Créer Un Produit
        </Button>
        <Stack
          component="form"
          gap="3rem"
          p="0.1rem 1.5rem"
          onSubmit={submitHandler}
          backgroundColor={theme.palette.background.alt}
          borderRadius="9px"
        >
          <FlexBetween>
            <InputBase
              placeholder="Serach ..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton type="submit">
              <Search />
            </IconButton>
          </FlexBetween>
        </Stack>
      </FlexBetween>
      {loadingdelete ? (<Loader />) : (null)}
      {errordelete && <Message variant="error">{errordelete.message}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <DataGrid
          height={100}
          getRowId={(row) => row._id}
          rows={products.products}
          columns={columns}
          rowCount={products.total || 0}
          rowsPerPageOptions={[15, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      )}
    </div>
  );
};

export default Products;
