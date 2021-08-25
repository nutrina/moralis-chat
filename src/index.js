import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router } from "react-router-dom";

function ConfigWarning() {
  return <div>
    Your project seems to be missing the App ID and server URL.
    Please follow the following steps:
    <ul>
      <li>
        create <a href="https://docs.moralis.io/moralis-server/getting-started/quick-start">Moralis Server Instance</a>
      </li>
      <li>
        in the project folder, make a copy of the file  <em>.env.sample</em> and name it <em>.env.local</em>
      </li>
      <li>
        fill in the App ID and server url
      </li>
      <li>
        restart this app (restart the <em>yarn</em> or <em>npm</em> process)
      </li>
    </ul>
  </div>
}

async function init() {
  const MORALIS_APP_ID = process.env.REACT_APP_MORALIS_APP_ID;
  const MORALIS_SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

  if (!MORALIS_APP_ID || !MORALIS_SERVER_URL) {
    ReactDOM.render(
      <>
        <React.StrictMode>
          <ConfigWarning />
        </React.StrictMode>
      </>,
      document.getElementById('root')
    );
  } else {
    ReactDOM.render(
      <>
        <React.StrictMode>
          <Provider store={store}>
            <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL}>
              <Router>
                <App />
              </Router>
            </MoralisProvider>
          </Provider>
        </React.StrictMode>
      </>,
      document.getElementById('root')
    );
  }
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();

}

init();
