import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.css';

export default (props) => {
  return (
    <div className={styles.Footer}>
      <span>
        <Link to="/note">Note To Our Users</Link>
        <span> | </span>
        <Link to="/about">About Us</Link>
      </span>
    </div>
  );
};
