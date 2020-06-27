import React from 'react';

import styles from './Footer.css';

export default (props) => {
  return (
    <div className={styles.Footer}>
      <span>
        <a href="/note">Note To Our Users</a>
        <span> | </span>
        <a href="/about">About Us</a>
      </span>
    </div>
  );
};
