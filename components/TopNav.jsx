import React from 'react';
import { inject, observer } from 'mobx-react';

import AvatarIcon from '../static/icons/avatar.svg';

export default inject(['appState'])(observer(({ appState }) => {
  const { currentUser } = appState;

  return (
    <div className="top-nav">
      <div className="top-nav-wrapper">
        <div className="top-nav__logo">Time for lunch</div>
        <div className="top-nav__current-user">
          <span className="top-nav__name">
            { currentUser.fullname ? currentUser.fullname : 'Welcome!' }
          </span>
          <AvatarIcon />
        </div>
      </div>
    </div>
  );
}));