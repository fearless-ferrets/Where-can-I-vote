import React from 'react';
import styles from './Navigation.css';

export default (props) => {
  return (
    <div className={styles.NavBar}>
      <div className={styles.site__title}><a href="/">Where Can I Vote?</a></div>
      <div className={styles.login__signup}>
        <span>
          <a href="/log-in">Log In</a>
          <span> | </span>
          <a href="/sign-up">Sign Up</a>
        </span>
      </div>
    </div>
  );
};
