import React, { useEffect, useState } from "react";
import "./newProduct.css";
import { useNavigate, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Loader from "components/Loader";
import Message from "components/Message";
import { resetProduct, updateProduct,fetchProductDetails, resetSuccessUpdate} from "slices/singleProductSlice";

const NewProduct = () => {
  const baseUrl = "http://localhost:5001";

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(`${baseUrl}/uploads/profile.png`);
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const newProduct = useSelector((state) => state.product);
  const { loading, error,    
    successUpdate,
    product,
  } = newProduct;

  useEffect(() => {
    if (successUpdate){
      dispatch(resetSuccessUpdate());
      navigate("/products")
    }else {
      if (!product || product._id !== id) {
        dispatch(fetchProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setBrand(product.brand);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
   
  }, [dispatch, id, product,successUpdate, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetProduct());
    }
  }, []);

  //   useEffect(() => {

  //     if (successUpdate) {
  //       dispatch({ type: PRODUCT_UPDATE_RESET });
  //     } else {
  //       if (!product.name || product._id !== id) {
  //         dispatch(listProductDetails(id));
  //       } else {
  //         setName(product.name);
  //         setPrice(product.price);
  //         setBrand(product.brand);
  //         setCountInStock(product.countInStock);
  //         setDescription(product.description);
  //       }
  //     }
  //   }, [dispatch, id, product, successUpdate, navigate]);

    const uploadFileHandler = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const { data } = await axios.post(`${baseUrl}/upload`, formData, config);
        const imageUrl = baseUrl + data;

        setImage(imageUrl);
      } catch (error) {
        console.error(error);
      }
    };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: id,
        name: name,
        price: price,
        image: image,
        brand: brand,
        description: description,
        countInStock: countInStock,
      })
    );
  };

  return (
    <div className="uperContainer">
      <h2>Modifier Votre Produit</h2>

      <div className="container">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <Stack
          component="form"
          onSubmit={submitHandler}
          spacing={2}
          sx={{
            display: "flex",
            flex: 2,
            flexDirection: "column",
            width: "100%",
            m: "2rem",
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src={product?.image ?? ""}
            sx={{ width: 200, height: 200, border: "1px solid #CDBFBC" }}
          />
          <div style={{ dispaly: "flex", marginBottom: "10px" }}>
            <p>Name : {product?.name ?? ""}</p>
            <TextField
              fullWidth
              label="Name"
              id="fullWidth"
              defaultValue={product?.name ?? ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ dispaly: "flex", marginBottom: "10px" }}>
            <p>Count In Stock : {product?.countInStock ?? ""}</p>
            <TextField
              fullWidth
              label="Count In Stock"
              id="fullWidth"
              defaultValue={product?.countInStock ?? ""}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </div>

          <div style={{ dispaly: "flex", marginBottom: "10px" }}>
            <p>Price : {product?.price ?? ""}</p>
            <TextField
              fullWidth
              label="Price "
              id="fullWidth"
              defaultValue={product?.price ?? ""}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div style={{ dispaly: "flex", marginBottom: "10px" }}>
            <p>Brand : {product?.brand ?? ""}</p>
            <TextField
              fullWidth
              label="Brand"
              id="fullWidth"
              defaultValue={product?.brand ?? ""}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <TextField
            id="standard-multiline-static"
            label="Description"
            defaultValue={product?.description ?? ""}
            multiline
            variant="filled"
            maxRows={4}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={image}
              sx={{
                width: 100,
                height: 100,
                border: "1px solid #CDBFBC",
                marginBottom: "10px",
              }}
            />
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              onChange={uploadFileHandler}
            ></input>
          </div>

          <Button
            variant="contained"
            style={{
              width: "70%",
              color: "white",
              paddingTop: "10px",
              paddingBottom: "10px",
              fontSize: "16px",
            }}
            color="success"
            type="submit"
          >
            Mettre à Jour
          </Button>
        </Stack>
      )}
      </div>
    </div>
  );
};

export default NewProduct;

// const NewProduct = () => {
//   const baseUrl = "http://localhost:5001";
//   const [uploading, setUploading] = useState(false);
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState(`${baseUrl}/uploads/profile.png`);
//   const [brand, setBrand] = useState("");
//   const [countInStock, setCountInStock] = useState(0);
//   const [description, setDescription] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   useEffect(() => {
//     if (userInfo && userInfo.isAdmin) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(
//       createProduct({
//         name: name,
//         price: price,
//         image: image,
//         brand: brand,
//         description: description,
//         countInStock: countInStock,
//       })
//     );
//     navigate("/products");
//   };

//   const uploadFileHandler = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("image", file);
//     setUploading(true);

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       const { data } = await axios.post(`${baseUrl}/upload`, formData, config);
//       const imaheUrl = baseUrl + data;

//       setImage(imaheUrl);
//       setUploading(false);
//     } catch (error) {
//       console.error(error);
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="uperContainer">
//       <h2>Creer Un Produit</h2>

//       <div className="container">
//         <Stack
//           component="form"
//           onSubmit={submitHandler}
//           spacing={2}
//           sx={{
//             display: "flex",
//             flex: 2,
//             flexDirection: "column",
//             width: "100%",
//             m: "2rem",
//           }}
//         >
//           <TextField
//             fullWidth
//             label="Name"
//             id="fullWidth"
//             onChange={(e) => setName(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             label="Count In Stock"
//             id="fullWidth"
//             onChange={(e) => setCountInStock(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             label="Price "
//             id="fullWidth"
//             onChange={(e) => setPrice(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             label="Brand"
//             id="fullWidth"
//             onChange={(e) => setBrand(e.target.value)}
//           />
//           <TextField
//             id="outlined-multiline-static"
//             label="Description"
//             multiline
//             maxRows={4}
//             onChange={(e) => setDescription(e.target.value)}
//           />

//           <div
//             style={{
//               flex: "1",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//             }}
//           >
//             <Avatar
//               alt="Remy Sharp"
//               src={image}
//               sx={{
//                 width: 100,
//                 height: 100,
//                 border: "1px solid #CDBFBC",
//                 marginBottom: "10px",
//               }}
//             />
//             <input
//               type="file"
//               id="avatar"
//               name="avatar"
//               accept="image/png, image/jpeg"
//               onChange={uploadFileHandler}
//             ></input>
//           </div>

//           <Button
//             variant="contained"
//             style={{
//               width: "70%",
//               color: "white",
//               paddingTop: "10px",
//               paddingBottom: "10px",
//               fontSize: "16px",
//             }}
//             color="success"
//             type="submit"
//           >
//             Ajouter
//           </Button>
//         </Stack>
//       </div>
//     </div>
//   );
// };

// export default NewProduct;
