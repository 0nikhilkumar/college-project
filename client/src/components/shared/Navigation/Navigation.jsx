import React from "react";
import styles from "./Navigation.module.css";
import { Link } from "react-router-dom";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  const brandStyles = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "5px",
  };

  async function logoutUser(){
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyles} to={"/"}>
        <img src="/images/logo1.png" alt="logo" />
        <span style={logoText}>OttonVoice</span>
      </Link>
      {isAuth && (
        <div className={styles.navRight}>
          <h3>{user.name}</h3>
          <Link to={"/"}>
            <img
              className={styles.avatar}
              src={user.avatar ? user?.avatar?.replace("http://localhost:5500", import.meta.env.VITE_API_URL) : "/images/monkey-avatar.png"}
              width={40}
              height={40}
              alt="avatar"
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src="/images/logout.png" alt="logout" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
