import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { setName } from '../../../store/activateSlice'
import styles from "./StepName.module.css"
import TextInput from '../../../components/shared/TextInput/TextInput'

const StepName = ({onNext}) => {
  const { name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(name);
  function nextStep(){
    if(!fullName) return;
    dispatch(setName(fullName));
    onNext()
  }
  return (
    <>
        <Card title={"What's your full name?"} icon={"goggle-emoji.png"}>
          <TextInput
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div>
            <p className={styles.paragraph}>
              People use real names at ottonVoice!
            </p>
            <div className={styles.actionButtonWrap}>
              <Button onClick={nextStep} text={"Next"} />
            </div>
          </div>
        </Card>
    </>
  );
}

export default StepName