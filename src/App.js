import React from 'react';
import { useMoralis } from "react-moralis";
import Header from './features/header/Header';
import Groups from './features/ChatGroups/Groups';
import Chat from './features/Chat/Chat';
import {
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";

import logo from './moralis/Powered-by-Moralis-Badge-Green.svg';
import styles from "./App.module.css";


function App() {
  let match = useRouteMatch();
  console.log("geri match app", match);
  const { isAuthenticated, isAuthenticating, isInitialized, authenticate, hasAuthError, authError } = useMoralis();
  let content = null;

  const handleLoginWithMetamask = () => {
    authenticate();
  }

  if (!window.ethereum) {
    content = <div className={styles.row}>
      <div>You do not seem to use a supported browser, or you do not have the <a href="https://metamask.io"> Metamask </a> plugin installed. <br />
        Please use supported browser like
        <a href="https://chrome.google.com/"> Chrome </a>
        or
        <a href="https://brave.com/"> Brave </a>
        and install a Web3 Wallet like
        <a href="https://metamask.io"> Metamask </a>.
      </div>
    </div>
  } else if (!isInitialized || isAuthenticating) {
    content = <div className={styles.row}>
      <div> Please wait, we are authentication you ... </div>
    </div>
  } else {
    if (!isAuthenticated) {
      content = <div className={styles.row}>
        <button className={styles.button} onClick={handleLoginWithMetamask}>Login with Metamask</button>
      </div>
    } else {
      content = <div className={styles.chatWindow}>
        <div className={styles.channelsWindow}>
          <Groups />
        </div>
        <div className={styles.msgWindow}>
          <Switch>
            <Route path={`${match.path}:chatId`}>
              <Chat />
            </Route>
            <Route path="/">
              <Chat />
            </Route>
          </Switch>
        </div>
      </div>

    }
  }

  let error = null;
  if (hasAuthError) {
    error = <div>
      <div className={styles.row}>Auth Error: {authError.message}</div>
      <div className={styles.row}>
        <span>
          Please make sure you have entered the correct information of your <a href="https://docs.moralis.io/moralis-server/getting-started/quick-start"> Moralis Server Instance </a> in the file <em>.env.local</em>
        </span>
      </div>
    </div>
  }

  return (
    <>
      <div className={styles.root}>
        <Header />
        <div className={styles.row}>
          <img src={logo} alt="Built With Moralis" />
        </div>
        <div className={styles.row}>
          <div className={styles.learnParagraph}>Learn more about <a href="https://moralis.io">Moralis</a></div>
        </div>
        <div className={styles.row}>
          {error}
        </div>
        {content}
      </div>
    </>
  );
}

export default App;
