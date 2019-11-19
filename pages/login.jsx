import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react';
import { observable, extendObservable, action } from 'mobx';
import axios from 'axios';
import to from 'await-to-js';
import Router from 'next/router';

import withFormBackground from '../components/WithFormBackground';

import UsernameIcon from '../public/icons/username.svg';
import PasswordIcon from '../public/icons/password.svg';

class LoginState {
  @observable username = '';
  @observable usernameError = '';
  @observable password = '';
  @observable passwordError = '';

  @action handleUpdateForm = e => {
    const value = e.currentTarget.value;
    const label = e.currentTarget.parentElement.firstChild;
    const prop = e.currentTarget.dataset.formElement;

    this[prop] = value;
    label.classList[value ? 'add' : 'remove']('hidden');

    const that = this;
    ({
      username: function () {
        if (!that.username)
          that.usernameError = 'Username is required';
        else
          that.usernameError = '';
      },
      password: function () {
        if (!that.password)
          that.passwordError = 'Password is required';
        else
          that.passwordError = '';
      }
    })[prop]();
  }

  @action validForm = () => {
    const errors = [];

    if (!this.username)
      errors.push(this.usernameError = 'Username is required');
    if (!this.password)
      errors.push(this.passwordError = 'Password is required');

    return errors.length === 0;
  }

  requestLogin = async e => {
    e.preventDefault();
    if (!this.validForm())
      return;

    const { username, password } = this;
    const [ err, res ] = await to(axios.post('/api/auth/signin', { username, password }));
    if (err) return err;

    if (res.data.error) {
      if (res.data.message === 'Login failed') {
        this.usernameError = res.data.error.username;
        this.passwordError = res.data.error.password;
      }
      return;
    }

    Router.push('/home');
  }
}

const loginState = new LoginState();

const Login = observer(() => {
  const {
    username, usernameError,
    password, passwordError,
    handleUpdateForm,
    requestLogin
  } = loginState;

  return (
    <div className="right-half">
      <div className="form-login-wrapper">
        <div className="title">Time for lunch</div>
        <form onSubmit={requestLogin} className="form form-login">
          <label htmlFor="username" className="form__input-group" style={{ marginTop: '64px' }}>
            <div className="form__icon-wrapper">
              <UsernameIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">username</div>
              <input type="text" className="form__input" id="username" defaultValue={username} onChange={handleUpdateForm} data-form-element="username" />
              {usernameError && <div className="form__error-msg">{usernameError}</div>}
            </div>
          </label>
          <label htmlFor="password" className="form__input-group">
            <div className="form__icon-wrapper">
              <PasswordIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">password</div>
              <input type="password" className="form__input" id="password" defaultValue={password} onChange={handleUpdateForm} data-form-element="password" />
              {passwordError && <div className="form__error-msg">{passwordError}</div>}
            </div>
            <Link href="#">
              <a className="form__forget-pwd">Forget your password?</a>
            </Link>
          </label>
          <div className="form__action-group">
            <button type="submit" className="btn btn__form-login">Login</button>
          </div>
        </form>
      </div>
      <div className="create-account">
        Don't have an account?<Link href="/signup"><a className="create-account__link">SignUp</a></Link>
      </div>
    </div>
  );
});

Login.getInitialProps = async ({ req, res, currentUser }) => {
  if (req) {
    if (req.cookies.token){
      res.writeHead(302, {
        location: '/'
      });
      res.end();
    }
  } else {
    if (currentUser.isAuth())
      Router.push('/');
  }

  return {};
}

export default withFormBackground(Login);