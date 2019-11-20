import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import axios from 'axios';
import to from 'await-to-js';

import TopNav from '../components/TopNav';

@inject(['currentUser'])
@observer
class Profile extends React.Component {
  static async getInitialProps({ currentUser }) {
    currentUser.requireAuth();
    return {};
  }

  requestUpdatePassword = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const currentPwd = form.elements['current-pwd'].value;
    const newPwd = form.elements['new-pwd'].value;
    const confirmPwd = form.elements['confirm-pwd'].value;

    if (newPwd !== confirmPwd)
      return alert('Password not match!');

    const [ err, res ] = await to(axios.post('/graphql', {
      query: `
        mutation UpdatePassword {
          updatePassword(currentPassword: "${currentPwd}", password: "${newPwd}")
        }
      `
    }));

    if (err)
      return console.error(err);

    if (!res.data.data.updatePassword)
      alert('Current password incorrect');

    location.reload();
  }

  requestUpdateProfile = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = form.elements.name.value;
    const email = form.elements.email.value;

    const [ err, res ] = await to(axios.post('/graphql', {
      query: `
        mutation UpdateProfile {
          updateProfile(fullname: "${name}", email: "${email}")
        }
      `
    }));

    if (err)
      return console.error(err);

    location.reload();
  }

  requestUpdateAvatar = async e => {
    e.preventDefault();

  }

  render() {
    const { requestUpdatePassword, requestUpdateProfile, requestUpdateAvatar } = this;
    const { avatarUrl, fullname, email } = this.props.currentUser;

    return (
      <div className="profile">
        <TopNav />
        <form className="form f-avatar">
          <img className="f-avatar__image" src={avatarUrl ? avatarUrl : '/icons/avatar.svg'} />
          <div className="upload-btn-wrapper">
            <button className="btn btn--update">Choose image</button>
            <input type="file" name="meal[image]" onChange={requestUpdateAvatar} accept="image/x-png,image/jpeg" />
          </div>
        </form>
        <form className="form f-profile" onSubmit={requestUpdateProfile}>
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
        <form className="form f-password" onSubmit={requestUpdatePassword}>
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