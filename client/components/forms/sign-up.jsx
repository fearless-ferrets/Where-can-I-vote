import React from 'react';
import styles from './sign-up.css';

const SignUpForm = () => {
  return (
    <div className={styles.form__div}>
      <h2 className={styles.form__title}>Sign Up:</h2>
      <div className={styles.form__container}>
        {/* put onsubmit function here */}
        <form className={styles.form}>
          <label className={styles.labels} htmlFor="username">
            Username
          </label>
          <input placeholder="User1" />
          <label className={styles.labels} htmlFor="password">
            Password
          </label>
          <input placeholder="************" type="password" />
          <label className={styles.labels} htmlFor="email">
            Email
          </label>
          <input placeholder="myname@gmail.com" type="email" />
          <button type="submit">
            <p className={styles.button_text}>
              Create Account
            </p>
          </button>
        </form>
      </div>
      {/* error handling can happen here with <div className={styles.errorMessage}>{error.error}</div> */}
    </div>
  );
};

export default SignUpForm;
