import React, { useEffect } from "react";
import "./users.css";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "@mui/material";
import Loader from "components/Loader";
import Message from "components/Message";
import { fetchUsers, resetUser, deleteUser , resetSuccessDelete } from "slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading, error, user, successDelete } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(resetUser());
    dispatch(fetchUsers());
    if (successDelete) {
    dispatch(fetchUsers());
     dispatch(resetSuccessDelete())
    }
  }, [dispatch, user, navigate,successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("ete vous sur?")) {
      dispatch(deleteUser(id));
    }
  };

  const navigateToNewUser = () => {
    navigate("/utilisateurs/newuser");
  };

  const columns = [
    { field: "_id", hide: true },
    {
      field: "name",
      flex: 1,
      headerName: "Name",
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "isAdmin",
      headerName: "Admin",
      flex: 1,
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/utilisateurs/singleuser/" + params.row._id}>
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
        onClick={navigateToNewUser}
      >
        Nouveaux Utilisateur
      </Button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <DataGrid
          height={100}
          getRowId={(row) => row._id}
          rows={users ?? []}
          columns={columns}
          rowsPerPageOptions={[10, 15, 20]}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default Users;
