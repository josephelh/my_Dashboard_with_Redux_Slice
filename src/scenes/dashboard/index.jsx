import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SalesBar from "components/SalesBar";
import MonthlyProductOrders from "components/MonthlyProductOrders";

const Dashboard = () => {
  return (
    <div style={{width:"100%" }}>
      <h2>Dashboard </h2>
      <div style={{ display: "flex", width:"100%", flexDirection:"column" }}>
      <div style={{width:"70vw"}}>
        <MonthlyProductOrders/>
        </div>
        <div style={{width:"50%"}}>
           <SalesBar />
        </div>
        
        
      </div>
    </div>
  );
};

export default Dashboard;
