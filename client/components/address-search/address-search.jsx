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
    <div className={styles.address__form}>
      <h2 className={styles.form__title}>Find local voting locations:</h2>
      <form onSubmit={onFormSubmit}>
        <div className={styles.main__banner}>
          <div className={styles.search__title}>
            <label className={styles.call__to__action} htmlFor="address">
              Enter your address below*
            </label>
          </div>
          <div className={styles.search__input__section}>
            <GeoSearchBar onSubmit={handleAddress} />
          </div>
          <p className={styles.subtext}>*US Addresses only</p>
          {error && <div className={styles.errorMessage}>{error.error}</div>}
          <div className={styles.Namesearch__button}>
            <button type="submit" className={styles.search__input__button}>
              <p className={styles.search__input__button_text}>
                Show My Locations
              </p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddressSearch;
