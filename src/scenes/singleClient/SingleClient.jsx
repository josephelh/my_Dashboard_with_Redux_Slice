import React, { createRef, useEffect, useState } from "react";
import "./singleClient.css";
import { useNavigate, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientDetails,
  updateClient,
} from "slices/clientSlice";
import Button from "@mui/material/Button";
import Loader from "components/Loader";
import Message from "components/Message";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { clientOrders, deleteOrder } from "slices/orderSlice";
import { DataGrid } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, useTheme } from "@mui/material";
import DataGridCustomToolbarNoSearch from "components/DataGridCustomToolbarNoSearch";
import { Link } from "react-router-dom";

const SingleClient = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(0);
  

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const qrRef = createRef();
  const theme = useTheme();


  const { error, loading, client } = useSelector((state) => state.clients);
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
    if (!client || client._id !== id) {
      dispatch(fetchClientDetails(id));
      dispatch(clientOrders(params));
    } else {
      setName(client.name);
      setAddress(client.address);
      setPhone(client.phone);
    }
  }, [dispatch, id, client, pageSize, page]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateClient({
        _id: client._id,
        name: name,
        email: address,
        phone: phone,
        user: client.user._id,
      })
    );
    navigate("/clients");
  };

  const deleteHandler = (id) => {
    if (window.confirm("ete vous sur?")) {
      dispatch(deleteOrder(id));
    }
  };

  //QR code Image download handller
  async function handleDownload() {
    const qrCodeImage = await htmlToImage.toPng(qrRef.current);

    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeImage;
    downloadLink.download = `${client.name}.png`;
    downloadLink.click();
  }


  const columns = [
    { field: "_id", hide: true },
    {
      field: "user.name",
      headerName: "Made by",
      flex: 1,
      renderCell: (params) => {
        return params.row.user.name;
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
      <h2>Modifier Client : {client?.name ?? ""} </h2>
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
              <h3>Name : {client?.name ?? ""} </h3>
              <TextField
                fullWidth
                label="Name"
                defaultValue={client?.name ?? ""}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ dispaly: "flex", marginBottom: "30px" }}>
              <h3>Address : {client?.address ?? ""}</h3>
              <TextField
                fullWidth
                label="Email"
                defaultValue={client?.address ?? ""}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ dispaly: "flex", marginBottom: "30px" }}>
              <h3>Phone : {client?.phone ?? ""}</h3>
              <TextField
                fullWidth
                label="Email"
                defaultValue={client?.phone ?? ""}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div style={{ dispaly: "flex", marginBottom: "30px" }}>
              <h3>Ajouter Par : {client?.user.name ?? ""}</h3>
            </div>
          </div>

          <div className="buttonContainer">            
            <div 
              ref={qrRef}
              style={{
                textAlign:'center',
                background:"white",
                height: "auto",
                padding:"14px",
                margin:"20px",
                width: "100%",
              }}
            >
              <QRCode
                // size={256}
                style={{ height: "auto", maxWidth: "90%", width: "80%" }}
                value={id}
                // viewBox={`0 0 256 256`}
              />
              <p style={{color:"black", fontSize:"1.5rem" , fontWeight:"700" , marginTop:"20px"}}>{name}</p>
            </div>
            <Button
              variant="contained"
              style={{
                width: "70%",
                color: "white",
                marginTop: "20px",
                marginBottom: "30px",
                fontSize: "12px",
              }}
              color="success"
              onClick={handleDownload}
            >
              Download QR
            </Button>
            <Button
              variant="contained"
              style={{
                width: "70%",
                color: "white",
                paddingTop: "10px",
                paddingBottom: "10px",
                marginTop: "10px",
                marginBottom: "20px",
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

export default SingleClient;


