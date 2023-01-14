import React, { useState } from "react";
import "./newClient.css";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  addClient
} from "slices/clientSlice";
import Button from "@mui/material/Button";


const NewClient = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.userLogin)


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
        addClient({        
        name: name,
        address: address,
        phone: phone,
        user: user._id,
      })
    );
    navigate("/clients");
  };


  return (
    <div className="uperContainer">
      <h2>Modifier Client :</h2>
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
              <h3>Name : </h3>
              <TextField
                fullWidth
                label="Name"                
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ dispaly: "flex", marginBottom: "30px" }}>
              <h3>Address : </h3>
              <TextField
                fullWidth
                label="Address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ dispaly: "flex", marginBottom: "30px" }}>
              <h3>Phone : </h3>
              <TextField
                fullWidth
                label="Phone"
                onChange={(e) => setPhone(e.target.value)}
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
      
    </div>
  );
};

export default NewClient;
