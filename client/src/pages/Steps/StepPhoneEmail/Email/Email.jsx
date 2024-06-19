import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import styles from "../StepPhoneEmail.module.css"
import TextInput from '../../../../components/shared/TextInput/TextInput'


const Email = ({onNext}) => {
  const [email, setEmail] = useState('');
  return (
    <Card title={"Enter your Email Id"} icon={"email-emoji.png"}>
      <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text={"Next"} onClick={onNext} />
        </div>
        <p className={styles.bottomParagraph}>
          By entering your number, you're agreeing to Our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
}

export default Email