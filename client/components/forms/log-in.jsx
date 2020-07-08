import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './log-in.css';
import { login, clearError } from '../../actions/user';

const LogInForm = ({ loggedIn, login, clearError, errorMessage }) => {
  if (loggedIn) {
    clearError();
    return <Redirect to="/" />;
  }

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  // on mount, clear the error message
  useEffect(() => {
    clearError();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className={styles.form__div}>
      <h2 className={styles.form__title}>Log In:</h2>
      <div className={styles.form__container}>
        <form className={styles.form}>
          <label className={styles.labels} htmlFor="username">
            Username
          </label>
          <input placeholder="User1" name="username" onChange={onChange} />
          <label className={styles.labels} htmlFor="password">
            Password
          </label>
          <input placeholder="************" name="password" type="password" onChange={onChange} />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              clearError();
              login(username, password);
            }}
          >
            <p className={styles.button_text}>
              Log In
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

const mapDispatchToProps = { login, clearError };

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
