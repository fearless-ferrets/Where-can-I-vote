import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.css';

export default (props) => {
  return (
    <div className={styles.NavBar}>
      <div className={styles.site__title}>
        <Link to="/">Where Can I Vote?</Link>
      </div>
      <div className={styles.login__signup}>
        <span>
          <Link to="/log-in">Log In</Link>
          <span> | </span>
          <Link to="/sign-up">Sign Up</Link>
        </span>
      </div>
    </div>
  );
};
