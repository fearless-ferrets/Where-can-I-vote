import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './sign-up.css';
import { signup, clearError } from '../../actions/user';

const SignUpForm = ({ loggedIn, signup, clearError, errorMessage }) => {
  if (loggedIn) {
    clearError();
    return <Redirect to="/" />;
  }

  const [bananas, setFormBananas] = useState({
    // this state is bananas b-a-n-a-n-a-s
    username: '',
    password: '',
    email: '',
  });

  const { username, password, email } = bananas;

  // on mount, clear the error message
  useEffect(() => {
    clearError();
  }, []);

  const onChange = (e) => setFormBananas({ ...bananas, [e.target.name]: e.target.value });

  return (
    <div className={styles.form__div}>
      <h2 className={styles.form__title}>Sign Up:</h2>
      <div className={styles.form__container}>
        <form className={styles.form}>
          <label className={styles.labels} htmlFor="username">
            Username
          </label>
          <input placeholder="User1" name="username" onChange={onChange} />
          <label className={styles.labels} htmlFor="password">
            Password
          </label>
          <input placeholder="************" type="password" name="password" onChange={onChange} />
          <label className={styles.labels} htmlFor="email">
            Email
          </label>
          <input placeholder="myname@gmail.com" type="email" name="email" onChange={onChange} />
          <button type="submit" onClick={(e) => {
            e.preventDefault();
            clearError();
            signup(username, password, email);
            }}>
            <p className={styles.button_text}>
              Create Account
            </p>
          </button>
        </form>
        <div className={styles.errorMessage}>{errorMessage}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loggedIn: state.userReducer.loggedIn,
  errorMessage: state.userReducer.errorMessage,
});

const mapDispatchToProps = { signup, clearError };

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
