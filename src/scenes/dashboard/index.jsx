import React from "react";
import SalesBar from "components/SalesBar";
import MonthlyProductOrders from "components/MonthlyProductOrders";
import { useDispatch, useSelector } from "react-redux";
import { getYearlTotal } from "slices/orderSlice";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useRef } from "react";
import { useTheme } from "@mui/material";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const prevYear = usePrevious(year);

  const dispatch = useDispatch();
  const theme = useTheme();


  const data = useSelector((state) => state.orders.yearTotal.total);

  useEffect(() => {
    if (!data || year !== prevYear) {
      dispatch(getYearlTotal(year));
    }
  }, [dispatch, data, year,prevYear]);

  return (
    <div style={{ width: "100%" }}>
      <h2>Dashboard </h2>
      <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <div style={{ width: "70vw" }}>
          <MonthlyProductOrders />
        </div>
        <div style={{display:"flex", marginBottom:"30px"}}>
          <div style={{ width: "65%" }}>
            <SalesBar />
          </div>
          <div style={{ width: "40%",display:"flex", alignItems:"center", justifyContent:"center",flexDirection:"column" }}>
            <Box  backgroundColor={theme.palette.background.alt} 
            sx={{
              height: 350,
              width:350,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              flexDirection:"column",
              borderRadius:"20px",
              
  
            }}>
              <div style={{fontSize:"40px", fontWeight:900}} >{data} $</div>
              <p>Total Sales</p>

            </Box>

            <Box sx={{ minWidth: 120, maxWidth: 130 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={year}
                  label="Age"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem value={2022}>2022</MenuItem>
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
