import React from 'react';
import App from 'next/app';
import { extendObservable, action, runInAction } from 'mobx';
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
      // previousPicks: [],
      // isLocked: false,
      // lunchStatus: '',
      // isConfirm: false
    });
  }

  @action pickMeal = m_id => {
    if (this.isLocked)
      return;

    this.todayPick = m_id;
    this.lunchStatus = 'LOCKED';
    setTimeout(() => {
      runInAction(() => this.lunchStatus = 'ORDERING');
    }, 1200);
  }

  @action unPickMeal = () => {
    this.todayPick = null;
  }

  @action confirm = () => {
    this.isConfirmed = true;
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