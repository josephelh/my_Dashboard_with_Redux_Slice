import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Products from "scenes/products/Products";
import SingleProduct from "scenes/singleProduct/SingleProduct";
import Login from "scenes/login/Login";
import Users from "scenes/utilisateurs/users";
import NewProduct from "scenes/newProduct/NewProduct";
import SingleUser from "scenes/singleUser/SingleUser";
import NewUser from "scenes/newUser/NewUser";
import Clients from "scenes/clients/Clients";
import SingleClient from "scenes/singleClient/SingleClient";
import NewClient from "scenes/newClient/NewClient";
import Orders from "scenes/orders/Orders";
import SingleOrder from "scenes/singleOrder/SingleOrder";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const [admin, setAdmin] = useState(false);

  const userLogin = useSelector((state) => state.users.userLogin)

  useEffect(()=> {
    if(userLogin){
      setAdmin(userLogin.isAdmin)
    }

  },[userLogin])


   return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={userLogin && admin ? <Layout /> : <Login />}
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/search" element={<Products />} />
            <Route path="/products/singleproduct/:id" element={<SingleProduct/>}/>
            <Route path="/products/newproduct/:id" element={<NewProduct/>}/>
            <Route path="/utilisateurs" element={<Users/>}/>
            <Route path="/utilisateurs/singleuser/:id" element={<SingleUser/>}/>
            <Route path="/utilisateurs/newuser" element={<NewUser/>}/>
            <Route path="/clients" element={<Clients/>}/>
            <Route path="/clients/search" element={<Clients/>}/>
            <Route path="/clients/singleclient/:id" element={<SingleClient/>}/>
            <Route path="/clients/newclient" element={<NewClient/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/orders/orderdetails/:id" element={<SingleOrder/>}/>
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
