import React, { useState } from 'react';
import styles from './sign-up.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../../actions/user';

const SignUpForm = ({ loggedIn, signup, errorMessage }) => {
  if(loggedIn) return <Redirect to="/"/>

  const [bananas, setFormBananas] = useState({
    // this state is bananas b-a-n-a-n-a-s
    username:'',
    password:'', 
    email:''
  });

  const { username, password, email } = bananas;

  const onChange = e => setFormBananas({ ...bananas, [e.target.name] : e.target.value })

  return (
    <div className={styles.form__div}>
      <h2 className={styles.form__title}>Sign Up:</h2>
      <div className={styles.form__container}>
        <form className={styles.form}>
          <label className={styles.labels} htmlFor="username">
            Username
          </label>
          <input placeholder="User1" name ="username" onChange={onChange}/>
          <label className={styles.labels} htmlFor="password">
            Password
          </label>
          <input placeholder="************" type="password" name="password" onChange={onChange}/>
          <label className={styles.labels} htmlFor="email">
            Email
          </label>
          <input placeholder="myname@gmail.com" type="email" name="email" onChange={onChange}/>
          <button type="submit" onClick={ (e) => {
            e.preventDefault();
            signup(username, password, email);
            } } >
            <p className={styles.button_text}>
              Create Account
            </p>
          </button>
        </form>
      </div>
      <div className={styles.errorMessage}>{errorMessage}</div> 
    </div>
  );
};

const mapStateToProps = state => ({
  loggedIn: state.userReducer.loggedIn,
  errorMessage: state.userReducer.errorMessage

});

const mapDispatchToProps = { signup }

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
