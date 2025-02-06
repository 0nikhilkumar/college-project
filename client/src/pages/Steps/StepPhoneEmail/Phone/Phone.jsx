import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import styles from "../StepPhoneEmail.module.css"
import { sendOtp } from '../../../../http';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';
import TextInput from '../../../../components/shared/TextInput/TextInput';

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();

  async function submit(){
    if(!phoneNumber) return;
    const {data} = await sendOtp({phone: phoneNumber});
    console.log(data);
    dispatch(setOtp({phone: data.phone, hash: data.hash, otp: data.otp}))
    onNext()
  }

  return (
    <Card title={"Enter your phone number"} icon={"phone.png"}>
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text={"Next"} onClick={submit} />
        </div>
        <p className={styles.bottomParagraph}>
          By entering your number, you're agreeing to Our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Phone