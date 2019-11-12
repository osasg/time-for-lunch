import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';

import TopNav from '../components/TopNav';

@inject(['currentUser'])
@observer
class Profile extends React.Component {
  @observable profile = { name: '', email: '' };
  @observable pwd = { password: '', confirm: ''};
  @observable avatar = null;

  requestUpdatePassword = () => {

  }

  requestUpdateProfile = () => {

  }

  requestUpdateAvatar = () => {

  }

  render() {
    const { avatarUrl, fullname, email } = this.props.currentUser;

    return (
      <div className="profile">
        <TopNav />
        <form className="form f-avatar">
          <img className="f-avatar__image" src={avatarUrl} />
          <button type="submit" className="btn btn--update">Update avatar</button>
        </form>
        <form className="form f-profile">
          <label className="form__input-group" htmlFor="f-profile__name">
            <p>Name</p>
            <input type="text" name="name" id="name" className="form__input" defaultValue={fullname} />
          </label>
          <label className="form__input-group" htmlFor="f-profile__email">
            <p>Email</p>
            <input type="text" name="email" id="email" className="form__input" defaultValue={email} />
          </label>
          <button type="submit" className="btn btn--update">Update profile</button>
        </form>
        <form className="form f-password">
          <label className="form__input-group" htmlFor="f-profile__current-pwd">
            <p>Current password</p>
            <input type="password" name="current-pwd" id="current-pwd" className="form__input" placeholder="***************" />
          </label>
          <label className="form__input-group" htmlFor="f-profile__new-pwd">
            <p>Password</p>
            <input type="password" name="new-pwd" id="new-pwd" className="form__input" placeholder="***************" />
          </label>
          <label className="form__input-group" htmlFor="f-profile__confirm-pwd">
            <p>Confirm</p>
            <input type="password" name="confirm-pwd" id="confirm-pwd" className="form__input" placeholder="***************" />
          </label>
          <button type="submit" className="btn btn--update">Update password</button>
        </form>
      </div>
    );
  }
}

export default Profile;