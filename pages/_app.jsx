import React from 'react';
import App from 'next/app';
import { Provider, observer } from 'mobx-react';
import { observable, extendObservable, runInAction } from 'mobx';
import ApolloClient from 'apollo-client';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client';
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
      avatarUrl: '',
      roles: []
    });
  }

  redirectToLoginPage = () => {
    Router.push('/login');
  }

  isAuth = () =>
    !!this.username

  requireAuth = () =>
    !!this.username || this.redirectToLoginPage()

  hasRole = (role) =>
    (this.requireAuth() && this.roles.includes(role)) || this.redirectToLoginPage()
}

const currentUser = new CurrentUser();

const client = new ApolloClient({
  link: createUploadLink({
    uri: 'http://localhost:3000/graphql',
    fetch
  }),
  cache: new InMemoryCache()
});

@observer class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { req, res } = ctx;

    // routing in client side, already have currentUser
    if (!req)
      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps({ ...ctx, currentUser })
          : {}
      };

    // server side, retrieve user from auth.requireAuth middleware
    let user = req.user;

    try {
      if (!user) {
        let token = req.cookies.token;

        if (!token)
          throw new Error('Token is require');

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        user = await req.repos.Account.findById({ _id: payload._id });
        if (!user)
          throw new Error('User is required');
      }

      const { username, fullname, email, avatarUrl, roles } = user;
      currentUser.username = username;
      currentUser.fullname = fullname;
      currentUser.email = email;
      currentUser.avatarUrl = avatarUrl;
      currentUser.roles = roles;

      // initial props after update currentUser state
      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps({ ...ctx, currentUser })
          : {}
      };

    } catch (err) {
      // token invalid or expired
      // still render if not require Auth
      // currentUser.name is empty
      res.clearCookie('token');
      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps({ ...ctx, currentUser })
          : {}
      };
    }
  }

  componentDidCatch(error, info) {
    console.log(error, info);
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
}

export default MyApp;