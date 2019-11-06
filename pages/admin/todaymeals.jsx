import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';

import AdminHead from '../../components/AdminHead';
import MealView from '../../components/MealView';
import DashboardNav from '../../components/DashboardNav';
import DashboardLayout from '../../components/DashboardLayout';

import data from '../../data-sample.json';

@observer class AdminTodayMeals extends React.Component {
  @observable todayMeals = [];
  @observable status = '';

  render() {
    return (
      <DashboardLayout>
        <div className="admin-todaymeals">
          <DashboardNav currentBoard="TodayMeals" />
          <AdminHead headName="Today Meals" searchable={false} />
          <div className="">
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

AdminTodayMeals.getInitialProps = async () => {
  return { meals: data.todayMeals };
}

export default AdminTodayMeals;