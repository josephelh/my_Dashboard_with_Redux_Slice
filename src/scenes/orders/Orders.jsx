import React, { useEffect, useState } from "react";
// import "./clients.css";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, useTheme } from "@mui/material";
import Loader from "components/Loader";
import Message from "components/Message";
import { fetchOrders } from "slices/orderSlice";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Orders = () => {
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const theme = useTheme();
  const dispatch = useDispatch();
  //   const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    const params = {
      page: page,
      pageSize: pageSize,
      sort: sort,
      keyword: keyword,
    };
    dispatch(fetchOrders(params));
  }, [dispatch, page, pageSize, keyword, sort]);

  //   const deleteHandler = (id) => {
  //     if (window.confirm("ete vous sur?")) {
  //       dispatch(deleteClient(id));
  //     }
  //   };

  //   const navigateToNewClient = () => {
  //     navigate("/clients/newclient");
  //   };

  //   const submitHandler = (e) => {
  //     e.preventDefault();
  //     if (keyword.trim()) {
  //       navigate(`/clients/search?keyword=${keyword}`);
  //     } else {
  //       navigate("/clients");
  //     }
  //   };

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
          <div style={{ marginTop: "15px", marginBottom: "15px", width:"100%"}}>
            <table style={{border:"1px solid gray", width:"100%"}}>
              <thead  >
                <tr>
                  <th style={{textAlign:"left"}}>
                    Name
                  </th>
                  <th style={{textAlign:"left"}}>
                    Quantity
                  </th>
                  <th style={{textAlign:"left"}}>
                    price
                  </th>
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
      field: "user.name",
      headerName: "Made by",
      flex: 1,
      renderCell: (params) => {
        return params.row.user.name;
      },
    },
    {
      field: "totalPrice",
      flex: 1,
      headerName: "Total",
      renderCell: (params) => {
        return `${(params.row.totalPrice).toFixed(2)} $`;
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
              //   onClick={() => deleteHandler(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <Box
      height="85vh"
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
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <DataGrid
          height={100}
          getRowHeight={() => "auto"}
          getRowId={(row) => row._id}
          rows={orders.orders ?? []}
          columns={columns}
          rowCount={orders.total || 0}
          rowsPerPageOptions={[15, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
          toolbar: { searchInput, setSearchInput, setKeyword },
          }}
        />
      )}
    </Box>
  );
};

export default Orders;

