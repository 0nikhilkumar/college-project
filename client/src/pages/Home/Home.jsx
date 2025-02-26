import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

const Home = () => {

  const navigate = useNavigate();

  const signInLink = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "10px",
  };

  const goToRegisterPage = () => {
    navigate("/authenticate")
  };

  return (
    <div className="cardWrapper">
      <Card title={"Welcome to OttonVoice!"} icon={"logo.png"}>
        <p className={styles.text}>
          We’re working hard to get OttonVoice ready for everyone! While we wrap
          up the finishing youches, we’re adding people gradually to make sure
          nothing breaks.
        </p>
        <div>
          <Button onClick={goToRegisterPage} text={"Let's Go"} />
        </div>
        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>Have an invite text?</span>
        </div>
      </Card>
    </div>
  );
};

export default Home;
