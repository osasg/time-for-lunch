import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react';
import { observable, extendObservable, action } from 'mobx';

import withFormBackground from '../components/WithFormBackground';

import UsernameIcon from '../static/icons/username.svg';
import PasswordIcon from '../static/icons/password.svg';

class LoginState {
  @observable username = '';
  @observable password = '';

  @action handleUpdateForm = e => {
    const value = e.currentTarget.value;
    const label = e.currentTarget.parentElement.firstChild;

    this[e.currentTarget.dataset.formElement] = value;
    label.classList[value ? 'add' : 'remove']('form__label-txt--hidden');
  }
}

const loginState = new LoginState();

const Login = observer(() => {
  return (
    <div className="right-half">
      <div className="form-wrapper">
        <div className="title">Time for lunch</div>
        <form method="POST" className="form form-login">
          <label htmlFor="username" className="form__input-group" style={{ marginTop: '64px' }}>
            <div className="form__icon-wrapper">
              <UsernameIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">username</div>
              <input type="text" className="form__input" id="username" defaultValue={loginState.username} onChange={loginState.handleUpdateForm} data-form-element="username" />
            </div>
          </label>
          <label htmlFor="password" className="form__input-group">
            <div className="form__icon-wrapper">
              <PasswordIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">password</div>
              <input type="password" className="form__input" id="password" defaultValue={loginState.password} onChange={loginState.handleUpdateForm} data-form-element="password" />
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

export default withFormBackground(Login);