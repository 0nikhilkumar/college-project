import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import { useEffect, useState } from "react";
import Activate from "./pages/activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
import Room from "./pages/Room.js/Room";


function App() {
  
  const { loading } = useLoadingWithRefresh();

  return (
      loading ? (<Loader message={"Loading, please wait..."}/>) : (
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            exact
            path="/authenticate"
            element={<GuestRoute Component={Authenticate} />}
          />
          <Route exact path="/" element={<GuestRoute Component={Home} />} />
          <Route
            exact
            path="/activate"
            element={<SemiProtected Component={Activate} />}
          />
          <Route
            exact
            path="/rooms"
            element={<ProtectedRoute Component={Rooms} />}
          />
          <Route
            exact
            path="/room/:id"
            element={<ProtectedRoute Component={Room} />}
          />
        </Routes>
      </BrowserRouter>
      )
  );
}

const GuestRoute = ({ Component }) => {
  const {isAuth} = useSelector((state)=> state.auth);
  const navigate = useNavigate()
  useEffect(()=>{

    if (isAuth) {
      navigate('/rooms')
    }
  }, [navigate, isAuth])

    return isAuth ? null : <Component />
}

const SemiProtected = ({Component}) => {
  const {user, isAuth} = useSelector((state)=> state.auth);
  const navigate = useNavigate();  
  useEffect(()=> {
    !isAuth ? navigate("/") : isAuth && !user?.activated ? (<Component />) : navigate("/rooms") 
  }, [isAuth, navigate, user?.activated])
  return <Component />
}

const ProtectedRoute = ({Component}) => {
  const {user, isAuth} = useSelector((state)=> state.auth);
  const navigate = useNavigate();  
  useEffect(()=> {
    !isAuth ? navigate("/") : isAuth && !user?.activated ? navigate("/activate") : <Component />
  }, [isAuth, navigate, user?.activated])
  return <Component />
}


export default App;
