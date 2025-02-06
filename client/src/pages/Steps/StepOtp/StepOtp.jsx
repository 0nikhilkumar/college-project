import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from "./StepOtp.module.css"
import { verifyOtp } from '../../../http';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import TextInput from '../../../components/shared/TextInput/TextInput';
// import { setUser } from '../../../store/authSlice';
import { toast } from "react-hot-toast";


const StepOtp = ({ onNext }) => {
  const {phone, hash, otp: resOtp} = useSelector((state)=> state.auth.otp);
  const [otp, setOtp] = useState(resOtp);
  const dispatch = useDispatch();
  async function submit(){
    if(!otp || !hash || !phone) return;
    try {
      const {data} = await verifyOtp({otp, phone, hash});
      dispatch(setAuth(data));
      toast.success("Otp Verified Successfully")
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message)
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