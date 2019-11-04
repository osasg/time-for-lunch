import React from 'react';
import Link from 'next/link';
import { inject, observer } from 'mobx-react';

import AvatarIcon from '../static/icons/avatar.svg';

export default inject(['appState'])(observer(({ appState }) => {
  const { currentUser } = appState;

  return (
    <div className="top-nav">
      <div className="top-nav-wrapper">
        <div className="top-nav__logo">
          <Link href="/lunch"><a>Time for lunch</a></Link>
        </div>
        <div className="top-nav__current-user">
          <Link href="/profile">
            <a>
              <span className="top-nav__name">
                { currentUser.fullname ? currentUser.fullname : 'Welcome!' }
              </span>
              <AvatarIcon />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}));