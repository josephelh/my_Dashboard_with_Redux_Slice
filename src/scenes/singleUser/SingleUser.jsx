import React, { useEffect, useState } from "react";
import "./singleUser.css";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams, Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Loader from "components/Loader";
import Message from "components/Message";
import { fetchUserDetails, resetUser, updateUser } from "slices/userSlice";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { userOrders, deleteOrder } from "slices/orderSlice";
import { DataGrid } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, useTheme } from "@mui/material";
import DataGridCustomToolbarNoSearch from "components/DataGridCustomToolbarNoSearch";



const SingleUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);

  

  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(0);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // show password and confirmPassword handlers
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const { loading, error, user } = useSelector((state) => state.users);
  const {
    orders,
    error: ordersError,
    loading: ordersLoading,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    const params = {
      page: page,
      pageSize: pageSize,
      id: id,
    };
    if (!user || user._id !== id) {
      dispatch(fetchUserDetails(id));
      dispatch(userOrders(params));
    } else {
      setAdmin(user.isAdmin);
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, id, user, page, pageSize]);

  useEffect(() => {
    return () => {
      dispatch(resetUser());
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUser({
          _id: user._id,
          name: name,
          email: email,
          isAdmin: admin,
          password: password,
        })
      );
      navigate("/utilisateurs");
    }
  };

  const deleteHandler = (id) => {
    if (window.confirm("ete vous sur?")) {
      dispatch(deleteOrder(id));
    }
  };

  const columns = [
    { field: "_id", hide: true },
    {
      field: "client.name",
      headerName: "Orders by",
      flex: 1,
      renderCell: (params) => {
        return params.row.client.name;
      },
    },
    {
      field: "orderItems",
      hide: true,
      flex: 3,
      headerName: "Details",

      renderCell: (params) => {
        return (
          <div
            style={{ marginTop: "15px", marginBottom: "15px", width: "100%" }}
          >
            <table style={{ border: "1px solid gray", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Name</th>
                  <th style={{ textAlign: "left" }}>Quantity</th>
                  <th style={{ textAlign: "left" }}>price</th>
                </tr>
              </thead>
              <tbody>
                {params.row.orderItems.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{item.price * item.qty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      },
    },    
    {
      field: "totalPrice",
      flex: 1,
      headerName: "Total",
      renderCell: (params) => {
        return `${params.row.totalPrice.toFixed(2)} $`;
      },
    },
    {
      field: "isPaid",
      headerName: "Is Paid",
      flex: 1,
      renderCell: (params) => {
        if (params.row.isPaid) {
          return <div> Paid</div>;
        } else {
          return <div> Not Paid</div>;
        }
      },
    },

    {
      field: "isDelivered",
      headerName: "Delivered",
      flex: 1,
      renderCell: (params) => {
        if (params.row.isDelivered) {
          return <div> Deliverded</div>;
        } else {
          return <div> Not Delivered yet</div>;
        }
      },
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/orders/orderdetails/" + params.row._id}>
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
    <>
      <div className="uperContainer">
        <h2>Modifier l'utilisateur : {user?.name ?? ""} </h2>
        {message && <Message variant="error">{message}</Message>}
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
            <div className="container">
              <div className="formContainer">
                <div style={{ dispaly: "flex", marginBottom: "30x" }}>
                  <p>Name : {user?.name ?? ""} </p>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={user?.name ?? ""}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div style={{ dispaly: "flex", marginBottom: "30px" }}>
                  <p>Email : {user?.email ?? ""}</p>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={user?.email ?? ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm Passwrod
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-confirpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>

                <div style={{ dispaly: "flex", marginBottom: "30px" }}>
                  <p>Admin : </p>
                  <Checkbox
                    color="success"
                    checked={admin}
                    onChange={(e) => setAdmin(e.target.checked)}
                  />
                </div>
              </div>

              <div className="buttonContainer">
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
              </div>
            </div>
          </Stack>
        )}
      </div>
      <Box
      height="70vh"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[100],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: theme.palette.primary.light,
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[100],
          borderTop: "none",
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${theme.palette.secondary[200]} !important`,
        },
      }}
    >
      {ordersLoading ? (
        <Loader />
      ) : ordersError ? (
        <Message variant="error">{error}</Message>
      ) : (
        <DataGrid
          height={100}
          getRowId={(row) => row._id}
          rows={orders?.orders ?? []}
          columns={columns}
          rowCount={orders?.total || 0}
          rowsPerPageOptions={[15, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          components={{ Toolbar: DataGridCustomToolbarNoSearch }}

        />
      )}
      </Box>
    </>
  );
};

export default SingleUser;
