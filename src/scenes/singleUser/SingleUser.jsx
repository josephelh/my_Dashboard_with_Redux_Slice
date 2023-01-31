import React, { useEffect, useState } from "react";
import "./singleUser.css";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams } from "react-router-dom";
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
import { useTheme } from "@mui/material";


const SingleUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);


  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const {loading, error, user } = useSelector((state) => state.users);

  useEffect(() => {
    if (!user || user._id !== id) {
      dispatch(fetchUserDetails(id));
    } else {
      setAdmin(user.isAdmin);
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, id, user]);

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
  return (
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
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
  );
};

export default SingleUser;
