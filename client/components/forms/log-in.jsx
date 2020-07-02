import React from 'react';
import styles from './log-in.css';

const LogInForm = () => {

  return (
    <div className={styles.form__div}>
      <h2 className={styles.form__title}>Log In:</h2>
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
          <button type="submit">
            <p className={styles.button_text}>
              Log In
            </p>
          </button>
        </form>
      </div>
      {/* error handling can happen here with <div className={styles.errorMessage}>{error.error}</div> */}
    </div>
  );

};

export default LogInForm;
