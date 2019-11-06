import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import withFormBackground from '../components/WithFormBackground';

import UsernameIcon from '../public/icons/username.svg';
import PasswordIcon from '../public/icons/password.svg';

class SignUpState {
  @observable username = '';
  @observable password = '';
  @observable confirm = '';

  @action handleUpdateForm = e => {
    const value = e.currentTarget.value;
    const label = e.currentTarget.parentElement.firstChild;

    this[e.currentTarget.dataset.formElement] = value;
    label.classList[value ? 'add' : 'remove']('form__label-txt--hidden');
  }
}

const signUpState = new SignUpState();

const SignUp = observer(() => {
  return (
    <div className="right-half">
      <div className="form-wrapper">
        <div className="lunch-title"><Link href="/login"><a>Time for lunch</a></Link></div>
        <div className="title">SignUp</div>
        <form method="POST" className="form form-login">
          <label htmlFor="username" className="form__input-group" style={{ marginTop: '64px' }}>
            <div className="form__icon-wrapper">
              <UsernameIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">username</div>
              <input type="text" className="form__input" id="username" defaultValue={signUpState.username} onChange={signUpState.handleUpdateForm} data-form-element="username" />
            </div>
          </label>
          <label htmlFor="password" className="form__input-group">
            <div className="form__icon-wrapper">
              <PasswordIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">password</div>
              <input type="password" className="form__input" id="password" defaultValue={signUpState.password} onChange={signUpState.handleUpdateForm} data-form-element="password" />
            </div>
          </label>
          <label htmlFor="confirm" className="form__input-group">
            <div className="form__icon-wrapper">
              <PasswordIcon />
            </div>
            <div className="form__input-wrapper">
              <div className="form__label-txt" data-form-element="username">confirm</div>
              <input type="confirm" className="form__input" id="confirm" defaultValue={signUpState.confirm} onChange={signUpState.handleUpdateForm} data-form-element="confirm" />
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