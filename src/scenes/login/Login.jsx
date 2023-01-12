import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Loader";
import { useNavigate } from "react-router-dom";
import Message from "components/Message";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { login } from "slices/userSlice";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);
  const { loading, error, userLogin } = users;

  useEffect(() => {
    if (userLogin) {
      if (userLogin.isAdmin) {
        navigate("/");
      } else {
        window.alert("you are not admin");
      }
    }
  }, [navigate, userLogin]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({email, password}));   
  };

  return (
    <>
      <div className="container">
        {error ? <Message variant="error">{error}</Message> : null}
        {loading ? <Loader /> : null}
        <div className="loginform">
          <h2>Connexion</h2>
          <Stack
            component="form"
            onSubmit={submitHandler}
            spacing={2}
            sx={{
              display: "flex",
              flex: 2,
              flexDirection: "column",
              m: "2rem",
            }}
          >
            <TextField
              required
              id="outlined-required"
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              id="outlined-required"
              label="Mot De Pass"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              style={{
                width: "100%",
                color: "white",
                paddingTop: "10px",
                paddingBottom: "10px",
                fontSize: "16px",
              }}
              color="success"
              type="submit"
            >
              Connexion
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default Login;
