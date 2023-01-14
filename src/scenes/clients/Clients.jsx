import React, { useEffect, useState } from "react";
import "./clients.css";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, IconButton, InputBase, Stack, useTheme } from "@mui/material";
import Loader from "components/Loader";
import Message from "components/Message";
import { fetchClients, deleteClient , resetSuccessDelete, resetClient } from "slices/clientSlice";
import { Search } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";

const Clients = () => {
  const [keyword, setKeyword] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clients, loading, error, successDelete } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(resetClient);
    dispatch(fetchClients(keyword));
    if (resetSuccessDelete){
      dispatch(fetchClients());
      dispatch(resetSuccessDelete);
    }
  }, [dispatch, keyword, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("ete vous sur?")) {
      dispatch(deleteClient(id));
    }
  };

  const navigateToNewClient = () => {
    navigate("/clients/newclient");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/clients/search?keyword=${keyword}`);
    } else {
      navigate("/clients");
    }
  };

  const columns = [
    { field: "_id", hide: true },
    {
      field: "name",
      flex: 1,
      headerName: "Name",
    },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "user.name",
      headerName: "Add By",
      flex: 1,
      renderCell: (params) => {
        return params.row.user.name;
      },
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/clients/singleclient/" + params.row._id}>
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
        height: "75vh",
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
          onClick={navigateToNewClient}
        >
          Nouveaux Client
        </Button>
        <Stack
          component="form"
          dosplay="flex"
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

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <DataGrid
          height={100}
          getRowId={(row) => row._id}
          rows={clients ?? []}
          columns={columns}
          rowsPerPageOptions={[10, 15, 20]}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default Clients;
