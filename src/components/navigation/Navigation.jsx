import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styles from './navigation.module.scss';
import { NavLink, Link } from 'react-router-dom';
import CartIcon from '../../shared/icons/CartIcon';
import RetrivLogo from '../../shared/icons/RetrivLogo';
import SearchBar from '../searchBar/SearchBar';
import { signOutUser } from '../../utils/firebase/firebase';
import { selectCurrentUser } from '../../store/user/userSelector';

const Navigation = (props) => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className={styles.header}>
      <div className={styles.navigation}>
        <div className={styles.navigation__container}>
          <div className={styles.logo__container}>
            <span>
              <Link to="/">
                <RetrivLogo />
              </Link>
            </span>
          </div>
          <SearchBar />
          <div className={styles.navigation__links__container}>
            <NavLink className={styles.navigation__links}>
              <CartIcon />
            </NavLink>
            <NavLink className={styles.navigation__links}>Profile</NavLink>
            {currentUser ? (
              <button
                className={styles.navigation__links}
                onClick={signOutUser}
              >
                Sign Out
              </button>
            ) : (
              <NavLink className={styles.navigation__links} to="/auth/signin">
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
