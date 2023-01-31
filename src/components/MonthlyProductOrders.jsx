import React, { useEffect, useState, useRef } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getProductOrderCountByMonth } from "slices/orderSlice";
import { useTheme } from "@mui/material";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const MonthlyProductOrders = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("");
  const theme = useTheme();

  const prevMonth = usePrevious(month);

  const prevYear = usePrevious(year);

  const dispatch = useDispatch();

  const data = useSelector((state) => state.orders.productOrderCountByMonth);
  const { loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!data || year !== prevYear || month !== prevMonth) {
      dispatch(getProductOrderCountByMonth({ year, month }));
    }
  }, [dispatch, data, year, month]);

  return (
    <>
      {data && data.length !== 0 ? (
        <ImageList
          sx={{
            height: 200,
            gridAutoFlow: "column",            
            backgroundColor:theme.palette.background.alt,
           

          }}
        >
          {data.map((item) => (
            <ImageListItem
              key={item._id.product}
              sx={{
                "& .MuiImageListItem-img":{
                    width: "70px",
                    height: "70px",
                }
              }}
              style={{
                marginLefr: "10px",
                marginRight: "10px",
                padding: "15px",
              }}
            >
              <img
                src={item.product_detail.image}                
                alt={item.name}
                loading="lazy"
              />
              <ImageListItemBar
                title={item.name}
                subtitle={<span style={{fontSize:"15px", marginTop:"15px"}}>Purshases: {item.totalPurshases}</span>}
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Box  
        backgroundColor={theme.palette.background.alt}
        sx={{
            height: 300,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            

          }}>
            <h2> no Orders For this Month</h2>

        </Box>
      )}

      <div style={{ display: "flex" }}>
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
        <Box sx={{ minWidth: 120, maxWidth: 130 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={month}
              label="Age"
              onChange={(e) => setMonth(e.target.value)}
            >
              <MenuItem value={""}>Select</MenuItem>
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>Feburary</MenuItem>
              <MenuItem value={4}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </>
  );
};

export default MonthlyProductOrders;
