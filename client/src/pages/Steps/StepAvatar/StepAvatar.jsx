import React, { useEffect, useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import { useDispatch, useSelector } from "react-redux";
import styles from "./StepAvatar.module.css"
import { setAvatar } from "../../../store/activateSlice.js";
import { activate } from '../../../http/index.js';
import { setAuth } from '../../../store/authSlice.js';
import Loader from '../../../components/shared/Loader/Loader.jsx';

const StepAvatar = ({onNext}) => {
  const {name, avatar} = useSelector((state)=> state.activate);
  const [image, setImage] = useState("/images/monkey-avatar.png");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const [unMounted, setUnMounted] = useState(false);

  function capturedImage(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(){
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    }
  }

  async function submit(){
    if(!name || !avatar) return;
    setLoading(true);
    try {
      const { data } = await activate({name, avatar});
      console.log(data);
      if(data.auth){
        // if(!unMounted){
          dispatch(setAuth(data))
        // }
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  // useEffect(()=> {
  //   return ()=> {
  //     setUnMounted(true)
  //   }
  // }, []);

  if(loading) return <Loader message={"Activation in progress..."}/>

  return (
    <>
      <Card title={`Okay, ${name}`} icon={"monkey-emoji.png"}>
        <p className={styles.subHeading}>How's this photo?</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImage} src={image} alt="avatar" />
        </div>
        <div>
          <input onChange={capturedImage} id="avatarInput" type="file" className={styles.avatarInput} />
          <label className={styles.avatarLabel} htmlFor="avatarInput">Choose a different photo</label>
        </div>
        <div className={styles.actionButtonWrap}>
          <Button onClick={submit} text={"Next"} />
        </div>
      </Card>
    </>
  );
}

export default StepAvatar