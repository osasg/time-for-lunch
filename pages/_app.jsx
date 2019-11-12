import React from 'react';
import App from 'next/app';
import { Provider, observer } from 'mobx-react';
import { observable, extendObservable, runInAction } from 'mobx';
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
      username: '',
      avatarUrl: ''
    });
  }
}

const currentUser = new CurrentUser();

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'localhost:3000/graphql',
    fetch
  }),
  cache: new InMemoryCache()
});

@observer class MyApp extends App {
  componentDidCatch(error, info) {
    console.log(error, info);
  }

  componentDidMount() {
    const { username, fullname, email, avatarUrl } = this.props.user;
    currentUser.username = username;
    currentUser.fullname = fullname;
    currentUser.email = email;
    currentUser.avatarUrl = avatarUrl;

    return null;
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
        let token = req.cookies.token;

        if (!token)
          throw new Error('Token is require');

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        user = await req.repos.Account.findById({ _id: payload._id});
        if (!user)
          return new Error('User is required');
      }

      return { user };

    } catch (err) {
      return { user: {} };
    }
  }
}

export default MyApp;