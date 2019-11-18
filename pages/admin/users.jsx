import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import to from 'await-to-js';

import DashboardLayout from '../../components/DashboardLayout';
import DashboardNav from '../../components/DashboardNav';
import AdminHead from '../../components/AdminHead';

import WhiteLockedIcon from '../../public/icons/white-locked.svg';
import WhiteUnlockedIcon from '../../public/icons/white-unlocked.svg';
import WhiteRemoveIcon from '../../public/icons/white-remove.svg';

class AdminUsersState {
  @observable searchStr = '';
  @observable users = null;
  @observable isReadyToUpdate = false;
}

const state = new AdminUsersState();

const AdminUsers = observer((props) => {
  if (props.users && !state.users)
    state.users = props.users;

  const handleMouseOver = e => {
    const info = e.currentTarget.querySelector('.user-view__info');
    const action = e.currentTarget.querySelector('.user-view__action');
  }

  const [ searchUsers, { loading, data, error }] = useLazyQuery(gql`
    query SearchUsers($pattern: String = "", $page: Int = 0, $perPage: Int = 20){
      users(search: { pattern: $pattern, page: $page, perPage: $perPage }) {
        _id
        fullname
        username
        email
      }
    }
  `);

  if (error)
    return console.error(error);

  if (loading)
    return <></>;

  if (data && state.isReadyToUpdate) {
    state.users = data.users;
    state.isReadyToUpdate = false;
  }

  if(!data && !state.users) {
    console.log('query')
    state.isReadyToUpdate = true;
    searchUsers({ variables: { pattern: '' } });
  }

  return (
    <DashboardLayout>
      <div className="admin-users">
        <DashboardNav currentBoard="Users" />
        <AdminHead
          headName="Users"
          handleSearchResources={() => searchMeals({ variables: { pattern: searchStr } })}
          parentState={state}
        />
        <div className="users-list resources-list">
          {state.users && state.users.map((u, i) =>
            <div key={i} className="user-view" onMouseOver={handleMouseOver}>
              <div className="user-view__avatar-wrapper">
                <img draggable={false} className="user-view__avatar" src={u.avatarUrl} alt="Avatar" />
              </div>
              <div className="user-view__info">
                <p className="user-view__name">{u.fullname}</p>
                <p className="user-view__headline">{u.headline}</p>
                <p className="user-view__email">{u.email}</p>
              </div>
              <div className="user-view__action">
                <div className="user-view__icon user-view__icon--lock">
                  {u.isLocked ? <WhiteUnlockedIcon /> : <WhiteLockedIcon />}
                </div>
                <div className="user-view__icon user-view__icon--remove"><WhiteRemoveIcon /></div>
                {u.isLocked && <div className="locked-meassage">Locked</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
});

AdminUsers.getInitialProps = async ({ req }) => {
  if (req) {
    const [ err, users ] = await to(req.repos.Account.search({ pattern: '' })) || [];
    if (err)
      return {};

    return { users };
  }
  return {};
}

export default AdminUsers;