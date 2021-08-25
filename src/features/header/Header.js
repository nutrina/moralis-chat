import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { useMoralis } from "react-moralis";
import { getBalancesAsync, reset as resetWallet, selectBalance } from '../wallet/walletSlice';

import styles from './Header.module.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useMoralis();
  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);

  function handleLoadBalance(event) {
    dispatch(getBalancesAsync({ accounts: user.get('accounts') }));
    event.preventDefault();
  }

  function handleLogout(event) {
    logout();
    dispatch(resetWallet());
    event.preventDefault();
  }

  const logoutButton = isAuthenticated ? <button className={styles.button}
    onClick={handleLogout}
    >Logout</button> : null;

  const gitHub = <a href="https://github.com/nutrina/cra-template-moralis">GitHub</a>;

  return (
    <nav>
      <div className={styles.logo}>
        Moralis Chat
      </div>
      <div className={styles.links}>
        {gitHub}
        {logoutButton}
      </div>
    </nav>
  );
};

export default Header;
