import React from 'react';
import { Outlet } from 'react-router-dom';

import Navigation from '../components/navigation/Navigation';
import styles from './rootLayout.module.scss';

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <main className={styles.rootLayout__main__container}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
