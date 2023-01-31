import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMonthlyOrderTotal } from "slices/orderSlice";
import { useState } from "react";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRef } from "react";


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


const SalesBar = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear); 
  const prevYear = usePrevious(year);

  const [formatedData, setFormatedData] = useState([]);
  const dispatch = useDispatch();
  const theme = useTheme();



  const data = useSelector((state) => state.orders.monthlyOrderTotal); 

  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  useEffect(() => {
    if (!data || year !== prevYear) {
      dispatch(getMonthlyOrderTotal(year));
    } else {
      const dataWithMonthName = data.map((obj) => {
        const monthName = months[obj._id - 1];
        return { ...obj, monthName };
      });
      setFormatedData(dataWithMonthName);
    }
  }, [dispatch, data, year]);

  useEffect(()=> {

  },[year])


  return (
    <>
    <div style={{height:600 , width:"100%"}}>
      <ResponsiveBar
        data={formatedData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        keys={["total"]}
        indexBy="monthName"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors="#52151c"
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Month",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Total",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#eae5e1"
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [{ on: "hover", style: { itemOpacity: 1 } }],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={year}
          label="Age"
          onChange={(e)=> setYear(e.target.value)}
        >
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
        </Select>
      </FormControl>
    </Box>
    </>
  );
};

export default SalesBar;
