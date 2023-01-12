import React, { useEffect, useState } from "react";
import "./products.css";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Loader from "components/Loader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Message from "components/Message";
import { fetchProducts } from "slices/productSlice";
import { createProduct, deleteProduct,resetSuccessCreate , resetSuccessDelete} from "slices/singleProductSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, products } = useSelector((state) => state.products);
  const productCreate = useSelector((state) => state.product);
  const {
    loading: loadingCreate,
    error: errorCreate,
    successCreate,
    createdProductId,
  } = productCreate
 const {loading:loadingdelete, error:errordelete, successDelete} = useSelector((state)=> state.product)

  useEffect(() => {
    if (successCreate) {
      navigate(`/products/newproduct/${createdProductId}`)     
    } else {
      dispatch(fetchProducts());
      dispatch(resetSuccessCreate());
    }
    if(successDelete){
      dispatch(fetchProducts());
      dispatch(resetSuccessDelete());
    }
    
  }, [dispatch, navigate,createdProductId,successCreate,successDelete]);

  const deleteHandler = (id)=>{
    if (window.confirm("ete vous sur?")) {
      dispatch(deleteProduct(id));
    }
  }

    const createProductHandler = () => {
    dispatch(createProduct());
    
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
    { field: "countInStock",align:'center', headerName: "Stock", flex: 1 },
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
    <div style={{ height: "77vh",marginRight:"20px", marginLeft:"20px" , marginTop:"20px" }}>
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
      {loadingdelete ? <Loader /> : null}
      {errordelete && <Message variant="error">{errordelete.message}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" />
      ) : (
        <DataGrid
          height={100}          
          getRowId={(row) => row._id}
          rows={products ?? []}
          columns={columns}
          rowsPerPageOptions={[10, 15, 20]}
          pageSize={10}
          
        />
      )}         
      
    </div>
  );
};

export default Products;
