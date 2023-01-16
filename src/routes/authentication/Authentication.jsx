import React from 'react';

import styles from './authentication.module.scss';
import { Outlet } from 'react-router-dom';

const Authentication = () => {
  return (
    <div className={styles.auth__container}>
      <Outlet />
    </div>
  );
};

export default Authentication;
