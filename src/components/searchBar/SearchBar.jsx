import React from 'react';
import styles from './searchBar.module.scss';
import SearchIcon from '../../shared/icons/SearchIcon';

const SearchBar = () => {
  return (
    <div className={styles.search__container}>
      <form className={styles.search__bar}>
        <input
          type="text"
          name="search"
          placeholder="search"
          className={styles.search__field}
        />
        <button type="submit" className={styles.search__button}>
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
