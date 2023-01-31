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

const SingleClient = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const qrRef = createRef();

  const { error, loading, client } = useSelector((state) => state.clients);

  useEffect(() => {
    if (!client || client._id !== id) {
      dispatch(fetchClientDetails(id));
    } else {
      setName(client.name);
      setAddress(client.address);
      setPhone(client.phone);
    }
  }, [dispatch, id, client]);


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

  //QR code Image download handller
  async function handleDownload() {
    const qrCodeImage = await htmlToImage.toPng(qrRef.current);

    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeImage;
    downloadLink.download = `${client.name}.png`;
    downloadLink.click();
  }

  return (
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
              <h3>Ajouter Par : {client?.user ?? ""}</h3>
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
  );
};

export default SingleClient;
