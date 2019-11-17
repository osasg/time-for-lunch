import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Link from 'next/link';
import to from 'await-to-js';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AdminHead from '../../../components/AdminHead';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';

import AddResourceIcon from '../../../public/icons/add-resource.svg';

class AdminTodayLunchState {
  @observable searchStr = '';
  @observable todayLunch = null;
  @observable isReadyToUpdate = false;
}

const state = new AdminTodayLunchState();

const AdminTodayLunch = observer((props) => {
  runInAction(() => {
    if (props.todayLunch && !state.todayLunch)
      state.todayLunch =  props.todayLunch || [];
  });

  const newTodayLunch = (
    <Link href="/admin/todaylunch/new"><a className="new-btn">
      <AddResourceIcon />
    </a></Link>
  );

  const [ searchTodayLunches, { error, loading, data }] = useLazyQuery(gql`
    query SearchTodayLunches($pattern: String = "", $page: Int = 0, $perPage: Int = 20) {
      todayLunch(search: { pattern: $pattern, page: $page, perPage: $perPage }) {
        _id
        createdAt
      }
    }
  `);

  if (loading)
    return <></>;

  if (data && state.isReadyToUpdate) {
    state.todayLunch = data.todayLunch;
    state.isReadyToUpdate = false;
  }

  if(!data && !state.todayLunch) {
    state.isReadyToUpdate = true;
    searchTodayLunches({ variables: { pattern: '' } });
  }

  return (
    <DashboardLayout>
      <div className="admin-todayLunch">
        <DashboardNav currentBoard="TodayLunch" />
        <AdminHead
          newResourceBtn={newTodayLunch}
          headName="Today Lunch"
          handleSearchResources={() => searchTodayLunches({ variables: { pattern: searchStr } })}
          parentState={state}
        />
        <div className="todayLunch-list resources-list">
          {state.todayLunch && state.todayLunch.map((todayLunch, i) =>
            <Link key={i} href={`/admin/todayLunch/${todayLunch._id}`}>
              <a></a>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
});

AdminTodayLunch.getInitialProps = async ({ req, res }) => {
  if (req) {
    const [ err, todayLunch ] = await to(req.repos.TodayLunch.search({ pattern: '', page: 0, perPage: 20 })) || [];
    if (err)
      return {};

    return { todayLunch };
  }
  return {};
}

export default AdminTodayLunch;