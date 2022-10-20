import { useState } from 'react';
import styles from '../styles/Login.module.css';

import { FiEye, FiEyeOff } from "react-icons/fi";

const Home = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogged, setKeepLogged] = useState(false);

  const [viewPassword, setViewPassword] = useState("password");

  const switchPasswordView = () => {
    if (viewPassword == "password") {
      setViewPassword("text");

      return
    }

    setViewPassword("password")
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>

        <div className={styles.logo}>
          <img src="./media/logo.png" alt="" />
        </div>

        <h1 className={styles.title}>
          Log In to ddash
        </h1>

        <span className={styles.subtitle}>Enter your email and password below</span>

        <form className={styles.form}>

          <div className={styles.inputArea}>
            <label className={styles.inputLabel} htmlFor="email">Email</label>
            <input type="email" placeholder='Email address' className={styles.input} />
          </div>

          <div className={styles.inputArea}>
            <span className={styles.inputMultipleArea}>
              <label className={styles.inputLabel} htmlFor="password">Password</label>
              <a className={styles.smallLink} href="#">Forgot password?</a>
            </span>

            <div className={styles.inputGroup}>
              <input type={viewPassword} placeholder='Password' className={styles.input} />
              <button onClick={switchPasswordView}><FiEye /></button>
            </div>

          </div>

          <button type="submit">Log In</button>

        </form>

        <span className={styles.footer}>Don't have an account? <a href="#">Sign up</a> </span>

      </div>
    </div>
  )
}

export default Home
