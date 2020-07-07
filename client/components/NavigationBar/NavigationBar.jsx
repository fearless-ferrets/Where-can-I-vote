import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../actions/user';
import styles from './Navigation.css';

const NavBar = ({ loggedIn, logOut }) => {
  return (
    <div className={styles.NavBar}>
      <div className={styles.site__title}>
        <Link to="/">Where Can I Vote?</Link>
      </div>
      <div className={styles.login__signup}>
        {!loggedIn && (
          <span>
            <Link to="/log-in">Log In</Link>
            <span> | </span>
            <Link to="/sign-up">Sign Up</Link>
          </span>
        )}
        {loggedIn && (
          <span>
            <Link to="/profile">Profile</Link>
            <span> | </span>
            <Link to="/" onClick={logOut}>Log Out</Link>
          </span>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loggedIn: state.userReducer.loggedIn,
});

const mapDispatchToProps = { logOut };

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);