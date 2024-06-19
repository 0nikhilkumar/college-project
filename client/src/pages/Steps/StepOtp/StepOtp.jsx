import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from "./StepOtp.module.css"
import { verifyOtp } from '../../../http';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import TextInput from '../../../components/shared/TextInput/TextInput';
// import { setUser } from '../../../store/authSlice';


const StepOtp = ({ onNext }) => {
  const [otp, setOtp] = useState("");
  const {phone, hash} = useSelector((state)=> state.auth.otp);
  const dispatch = useDispatch();
  async function submit(){
    if(!otp || !hash || !phone) return;
    try {
      const {data} = await verifyOtp({otp, phone, hash});
      console.log(data);
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card
          title={"Enter the code we just texted you"}
          icon={"lock-emoji.png"}>
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div>
            <div className={styles.actionButtonWrap}>
              <Button onClick={submit} text={"Next"} />
            </div>
            <p className={styles.bottomParagraph}>
              By entering your number, you're agreeing to Our Terms of Service
              and Privacy Policy. Thanks!
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepOtp