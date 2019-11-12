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
  constructor({ fullname, email, avatarUrl }) {
    extendObservable(this, {
      fullname: fullname,
      email: email,
      avatarUrl: avatarUrl
    });
  }
}

class MyApp extends App {
  render() {
    const {
      Component, pageProps,
      user: { fullname, email, avatarUrl },
      link
    } = this.props;

    const client = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });

    const currentUser = new CurrentUser({ fullname, email, avatarUrl });

    return (
      <ApolloProvider client={client}>
        <Provider currentUser={currentUser}>
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    );
  }

  static async getInitialProps({ ctx: { req, res } }) {
    let user;
    const link = createHttpLink({
      uri: req && req.headers.host + '/graphql',
      fetch
    });

    try {
      let token = req.headers['x-access-token'] || req.headers['authorization'];

      if (!token)
        throw new Error('Token is require');

      if (token.startsWith('Bearer '))
        token = token.slice(7);

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = req.user || req.repos.Account.findById({ _id: payload._id});
      return { user, link };

    } catch (err) {
      return { user: {}, link };
    }

  }
}

export default MyApp;