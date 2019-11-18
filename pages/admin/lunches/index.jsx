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

class AdminLunchState {
  @observable searchStr = '';
  @observable lunches = null;
  @observable isReadyToUpdate = false;
}

const state = new AdminLunchState();

const AdminLunch = observer((props) => {
  runInAction(() => {
    if (props.lunches && !state.lunches)
      state.lunches =  props.lunches || [];
  });

  const newLunch = (
    <Link href="/admin/lunches/new"><a className="new-btn">
      <AddResourceIcon />
    </a></Link>
  );

  const [ searchLunches, { error, loading, data }] = useLazyQuery(gql`
    query SearchLunches($pattern: String = "", $page: Int = 0, $perPage: Int = 20) {
      lunches(search: { pattern: $pattern, page: $page, perPage: $perPage }) {
        _id
        date
      }
    }
  `);

  if (error)
    return console.error(error);

  if (loading)
    return <></>;

  if (data && state.isReadyToUpdate) {
    state.lunches = data.lunches;
    state.isReadyToUpdate = false;
  }

  if(!data && !state.lunches) {
    state.isReadyToUpdate = true;
    searchLunches({ variables: { pattern: '' } });
  }

  return (
    <DashboardLayout>
      <div className="admin-lunches">
        <DashboardNav currentBoard="Lunches" />
        <AdminHead
          newResourceBtn={newLunch}
          headName="Lunches"
          handleSearchResources={() => searchLunches({ variables: { pattern: searchStr } })}
          parentState={state}
        />
        <div className="lunches-list resources-list">
          {state.lunches && state.lunches.map((lunches, i) =>
            <Link key={i} href={`/admin/lunches/${lunches._id}`}>
              <a></a>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
});

AdminLunch.getInitialProps = async ({ req, res }) => {
  if (req) {
    const [ err, lunches ] = await to(req.repos.Lunch.search({ pattern: '', page: 0, perPage: 20 })) || [];
    if (err)
      return {};

    return { lunches };
  }
  return {};
}

export default AdminLunch;