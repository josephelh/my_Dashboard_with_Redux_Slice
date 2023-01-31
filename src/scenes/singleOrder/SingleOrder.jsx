import React, { useEffect, useState } from "react";
import "./singleOrder.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Loader from "components/Loader";
import Message from "components/Message";
import { fetchOrder } from "slices/orderSlice";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

const SingleOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { order, loading, error } = useSelector((state) => state.orders);
  const date = new Date(order?.createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minites = date.getMinutes();

  useEffect(() => {
    if (!order || order._id !== id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id]);

  const subTotal = order?.orderItems.reduce((acc, o) => acc + (o.price * o.qty), 0).toFixed(2)


  const columns = [
    { field: "_id", hide: true },
    {
      field: "name",
      headerName: "Product ",
      headerClassName: "gridHeader",
      flex: 1,
    },
    {
      field: "qty",
      headerName: "Quantity",
      headerClassName: "gridHeader",
      flex: 1,
    },
    {
      field: "price",
      flex: 1,
      headerName: "Sub Total",
      headerClassName: "gridHeader",
    },
  ];

  

  return (
    <div className="topContainer">
      <h2>Order : {order?._id || ""} </h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="topOrderContainer">
          <div className="orderContainer">
            <Box sx={{ height: 150, width: "100%" }}>
              <DataGrid
                height={100}
                getRowId={(row) => row._id}
                rows={order?.orderItems ?? []}
                columns={columns}
                hideFooter={true}
                rowHeight={30}
                headerHeight={40}
              />
            </Box>
            <div className="orderDetailsItem">
              <h4 className="orderDetailsItemChild">Client</h4>
              <h4 className="orderDetailsItemChild">
                : {order?.client.name || ""}
              </h4>
            </div>
            <div className="orderDetailsItem">
              <h4 className="orderDetailsItemChild">Order Made By</h4>
              <h4 className="orderDetailsItemChild">
                : {order?.user.name || ""}
              </h4>
            </div>
            <div className="orderDetailsItem">
              <h4 className="orderDetailsItemChild">Order Created At</h4>
              <h4 className="orderDetailsItemChild">
                :  {`${year}-${month}-${day} at ${hour}:${minites}`}
              </h4>
            </div>
          </div>
          
          <Stack m={2} p={1} divider={<Divider />} >
            <div className="rightSideOrderDetails">
              <p className="rightSideOrderDetailsChild">Delivered</p>
              <p className="rightSideOrderDetailsChild">
                : {order?.isDelivered ? "Yes" : "No" || ""}
              </p>
            </div>
            <div className="rightSideOrderDetails">
              <p className="rightSideOrderDetailsChild">Paid</p>
              <p className="rightSideOrderDetailsChild">
                : {order?.isPaid ? "Yes" : "No" || ""}
              </p>
            </div>
            <div className="rightSideOrderDetails">
              <p className="rightSideOrderDetailsChild">Tax Price</p>
              <p className="rightSideOrderDetailsChild">
                : {order?.taxPrice || ""}
              </p>
            </div>
            <div className="rightSideOrderDetails">
              <p className="rightSideOrderDetailsChild">Sub Total</p>
              <p className="rightSideOrderDetailsChild">
                : {subTotal || ""}
              </p>
            </div>
            <div className="rightSideOrderDetails">
              <h4 className="rightSideOrderDetailsChild">Total</h4>
              <h3 className="rightSideOrderDetailsChild">
                : {`${order?.totalPrice}$` || "$"}
              </h3>
            </div>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default SingleOrder;
