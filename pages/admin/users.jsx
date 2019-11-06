import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';

import DashboardLayout from '../../components/DashboardLayout';
import DashboardNav from '../../components/DashboardNav';
import AdminHead from '../../components/AdminHead';

import data from '../../data-sample.json';

@observer class AdminUsers extends React.Component {
  @observable searchStr = '';
  @observable filteredUsers = [];

  @action handleFilterUsers = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filteredUsers = this.props.users.filter(m =>
      m.fullname.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }

  componentDidMount() {
    runInAction(() => {
      this.filteredUsers = this.props.users;
    });
  }

  render () {
    return (
      <DashboardLayout>
        <div className="admin-users">
          <DashboardNav currentBoard="Users" />
          <AdminHead headName="Users" handleFilterResources={this.handleFilterUsers} searchStr={this.searchStr} />
          <div className="users-list resources-list">
            {this.filteredUsers.map((u, i) =>
              <div key={i} className="user-view">
                <div className="user-view__avatar_wrapper">
                  <img draggable={false} className="user-view__avatar" src={u.avatarUrl} alt="Avatar" />
                </div>
                <div className="user-view__info">
                  <p className="user-view__name">{u.fullname}</p>
                  <p className="user-view__headline">{u.headline}</p>
                  <p className="user-view__email">{u.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

AdminUsers.getInitialProps = async () => {
  return { users: data.users };
}

export default AdminUsers;