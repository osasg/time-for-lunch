import React from 'react';
import App from 'next/app';
import { extendObservable } from 'mobx';
import { Provider } from 'mobx-react';

import '../styles/styles.scss';

import data from '../data-sample.json';

class AppState {
  constructor() {
    extendObservable(this, {
      ...data
      // currentUser: null,
      // todayMeals: [],
      // todayPick: null,
      // previousPicks: []
    });
  }
}

const appState = new AppState();

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider appState={appState}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;