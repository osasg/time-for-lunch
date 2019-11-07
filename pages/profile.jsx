import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';

import TopNav from '../components/TopNav';

@inject(['appState'])
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
    const { avatarUrl, fullname, email } = this.props.appState.currentUser;

    return (
      <div className="profile">
        <TopNav />
        <div className="p-avatar">
          <img className="p-avatar__image" src={avatarUrl} />
          <button className="btn btn--update">Update avatar</button>
        </div>
        <div className="p-profile">
          <label htmlFor="p-profile__name">
            <p>Name</p>
            <input type="text" name="name" id="name" className="p-profile__input" defaultValue={fullname} />
          </label>
          <label htmlFor="p-profile__email">
            <p>Email</p>
            <input type="text" name="email" id="email" className="p-profile__input" defaultValue={email} />
          </label>
          <button className="btn btn--update">Update profile</button>
        </div>
        <div className="p-password">
          <label htmlFor="p-profile__current-pwd">
            <p>Current password</p>
            <input type="password" name="current-pwd" id="current-pwd" className="p-profile__input" placeholder="***************" />
          </label>
          <label htmlFor="p-profile__new-pwd">
            <p>Password</p>
            <input type="password" name="new-pwd" id="new-pwd" className="p-profile__input" placeholder="***************" />
          </label>
          <label htmlFor="p-profile__confirm-pwd">
            <p>Confirm</p>
            <input type="password" name="confirm-pwd" id="confirm-pwd" className="p-profile__input" placeholder="***************" />
          </label>
          <button className="btn btn--update">Update password</button>
        </div>
      </div>
    );
  }
}

export default Profile;