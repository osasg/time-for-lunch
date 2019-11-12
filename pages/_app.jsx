import React from 'react';
import App from 'next/app';
import { Provider } from 'mobx-react';
import { observable, extendObservable } from 'mobx';
import ApolloClient from 'apollo-client';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import jwt from 'jsonwebtoken';
import { InMemoryCache } from 'apollo-cache-inmemory'
import co from 'co';
import Router from 'next/router';

import '../styles/styles.scss';

class CurrentUser {
  constructor() {
    extendObservable(this, {
      fullname: '',
      email: '',
      avatarUrl: ''
    });
  }
}

const currentUser = observable(new CurrentUser());
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'localhost:3000/graphql',
    fetch
  }),
  cache: new InMemoryCache()
});

class MyApp extends App {
  componentDidCatch(error, info) {
    console.log(error, info)
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Provider currentUser={currentUser}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Provider>
    );
  }

  static async getInitialProps({ ctx: { req, res } }) {
    if (!req)
      return {};

    let user = req.user;
    try {
      if (!user) {
        let token = req.headers['x-access-token'] || req.headers['authorization'];

        if (!token)
          throw new Error('Token is require');

        if (token.startsWith('Bearer '))
          token = token.slice(7);

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        user = req.repos.Account.findById({ _id: payload._id});
        if (!user)
          return new Error('User is required');
      }

      currentUser.username = user.username;
      currentUser.fullname = user.fullname;
      currentUser.avatarUrl = user.avatarUrl;
      return {};

    } catch (err) {
      return {};
    }
  }
}

export default MyApp;