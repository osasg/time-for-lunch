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
      avatarUrl: '',
      roles: []
    });
  }

  redirectToLoginPage = () => {
    Router.push('/login');
  }

  isAuth = () =>
    !!this.username

  hasRole = (role) =>
    this.roles && this.roles.includes(role)

  requireAuth = () =>
    !!this.username || this.redirectToLoginPage()

  requireRole = (roles) => {
    this.requireAuth();

    if (!roles.some(r => this.roles.includes(r)))
      this.redirectToLoginPage();
  }
}

// currentUser init in both server and client
const currentUser = new CurrentUser();

const client = new ApolloClient({
  link: createHttpLink({
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

      const { _id, username, fullname, email, avatarUrl, roles } = user;

      currentUser._id = _id.toString();
      currentUser.username = username;
      currentUser.fullname = fullname;
      currentUser.email = email;
      currentUser.avatarUrl = avatarUrl;
      currentUser.roles = roles;

      // initial props after update currentUser state
      return {
        user: currentUser, // pass currentUser state to client side via props
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

  constructor(props) {
    super(props);

    if (!props.user)
      return;

    const { _id, username, fullname, email, avatarUrl, roles } = props.user;

    // get state from server side and assign it to client side
    runInAction(() => {
      currentUser._id = _id.toString();
      currentUser.username = username;
      currentUser.fullname = fullname;
      currentUser.email = email;
      currentUser.avatarUrl = avatarUrl;
      currentUser.roles = roles;
    });
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    const { Component, pageProps, user } = this.props;

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