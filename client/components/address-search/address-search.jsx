import React, { useState, useEffect } from 'react';
import GeoSearchBar from '../geo-search-bar/GeoSearchBar';
import styles from './address-search.css';

const AddressSearch = ({ onSubmit, error }) => {
  const [address, setAddress] = useState();

  const handleAddress = (payload) => {
    setAddress(payload);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(address);
  };

  useEffect(() => {
    setAddress('');
  }, []);

  return (
    <div className={styles.MainContainer}>
      <div className={styles.form__div}>
        <h2 className={styles.form__title}>Find local voting locations:</h2>
        <div className={styles.form__container}>
          <form className={styles.form} onSubmit={onFormSubmit}>
            <label className={styles.call__to__action} htmlFor="address">
              Enter your address below*
            </label>
            <GeoSearchBar onSubmit={handleAddress} />
            <p className={styles.subtext}>*US Addresses only</p>
            <button type="submit" className={styles.search__input__button}>
              <p className={styles.search__input__button_text}>
                Show My Locations
              </p>
            </button>
          </form>
        </div>
        {error && <div className={styles.errorMessage}>{error.error}</div>}
      </div>
    </div>
  );
};

export default AddressSearch;
