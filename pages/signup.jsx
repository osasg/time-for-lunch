import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import axios from 'axios';
import to from 'await-to-js';
import Router from 'next/router';

import withFormBackground from '../components/WithFormBackground';

import UsernameIcon from '../public/icons/username.svg';
import PasswordIcon from '../public/icons/password.svg';

class SignUpState {
  @observable username = '';
  @observable usernameError = '';
  @observable password = '';
  @observable passwrodError = '';
  @observable confirm = '';
  @observable confirmError = '';

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
      },
      confirm: function () {
        if (that.password !== that.confirm)
          that.confirmError = 'Password not match';
        else
          that.confirmError = '';
      }
    })[prop]();
  }

  @action validForm = () => {
    const errors = [];

    if (!this.username)
      errors.push(this.usernameError = 'Username is required');
    if (!this.password)
      errors.push(this.passwordError = 'Password is required');
    if (this.password !== this.confirm)
      errors.push(this.confirmError = 'Password not match');
    else if (!this.confirm)
      errors.push(this.confirmError = 'Confirm is required');

    return errors.length === 0;
  }

  requestSignUp = async e => {
    e.preventDefault();
    if (!this.validForm())
      return;

    const { username, password } = this;

    const [ err, res ] = await to(axios.post('/api/auth/signup', { username, password }));
    if (err) return err;

    if (res.data.error)
      return;

    Router.push('/lunch');
  }
}

const signUpState = new SignUpState();

const SignUp = observer(() => {
  const {
    username, usernameError,
    password, passwordError,
    confirm, confirmError,
    handleUpdateForm,
    requestSignUp
  } = signUpState;

  return (
    <div className="right-half">
      <div className="form-login-wrapper">
        <div className="lunch-title"><Link href="/login"><a>Time for lunch</a></Link></div>
        <div className="title">SignUp</div>
        <form onSubmit={requestSignUp} className="form form-login">
          <label htmlFor="username" className="form__input-group" style={{ marginTop: '64px' }}>
            <div className="form__icon-wrapper">
              <UsernameIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">username</div>
              <input autoComplete="off" type="text" className="form__input" id="username" defaultValue={username} onChange={handleUpdateForm} data-form-element="username" />
              {usernameError && <div className="form__error-msg">{usernameError}</div>}
            </div>
          </label>
          <label htmlFor="password" className="form__input-group">
            <div className="form__icon-wrapper">
              <PasswordIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">password</div>
              <input autoComplete="off" type="password" className="form__input" id="password" defaultValue={password} onChange={handleUpdateForm} data-form-element="password" />
              {passwordError && <div className="form__error-msg">{passwordError}</div>}
            </div>
          </label>
          <label htmlFor="confirm" className="form__input-group">
            <div className="form__icon-wrapper">
              <PasswordIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">confirm</div>
              <input autoComplete="off" type="password" className="form__input" id="confirm" defaultValue={confirm} onChange={handleUpdateForm} data-form-element="confirm" />
              {confirmError && <div className="form__error-msg">{confirmError}</div>}
            </div>
          </label>
          <div className="form__action-group">
            <button type="submit" className="btn btn__form-login">SignUp</button>
          </div>
        </form>
      </div>
      <div className="create-account">
        Already have an account?<Link href="/login"><a className="create-account__link">Login</a></Link>
      </div>
    </div>
  );
});

export default withFormBackground(SignUp);