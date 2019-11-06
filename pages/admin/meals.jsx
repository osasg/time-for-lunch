import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action } from 'mobx';

import AdminHead from '../../components/AdminHead';
import MealView from '../../components/MealView';
import DashboardNav from '../../components/DashboardNav';
import withDashboadLayout from '../../components/WithDashboardLayout';

import data from '../../data-sample.json';

class AdminMealsState {
  constructor({ meals, filterMeals }) {
    extendObservable(this, {
      searchStr: '',
      meals: data.todayMeals,
      filterMeals: data.todayMeals
    });
  }

  @action handleFilterMeals = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filterMeals = this.meals.filter(m =>
      m.name.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }
}

const adminMealsState = observable(new AdminMealsState({
  meals: data.todayMeals,
  filterMeals: data.todayMeals
}));

const AdminMeals = observer(() => {
  return (
    <div className="admin-meals">
      <DashboardNav />
      <AdminHead handleFilterMeals={adminMealsState.handleFilterMeals} searchStr={adminMealsState.searchStr} />
      <div className="meals-list">
        {adminMealsState.filterMeals.map((meal, i) =>
          <MealView key={i} meal={meal} handleOnClick={() => {}} />
        )}
      </div>
    </div>
  );
});

export default withDashboadLayout(() => <AdminMeals />);