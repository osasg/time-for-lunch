import React from 'react';
import { observer } from 'mobx-react';
import { extendObservable, action } from 'mobx';

import MealView from '../../components/MealView';
import DashboardNav from '../../components/DashboardNav';
import withDashboadLayout from '../../components/WithDashboardLayout';

import data from '../../data-sample.json';

class AdminMealsState {
  constructor({ meals, filterMeals }) {
    extendObservable(this, {
      meals: data.todayMeals,
      filterMeals: data.todayMeals
    });
  }

  @action handleFilterMeals = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filterMeals = this.meals.filter(m =>
      m.name.toLowerCase().spilt(/\s/).join('').include(strToFilter));
  }
}

const adminMealsState = new AdminMealsState({
  meals: data.todayMeals,
  filterMeals: data.todayMeals
});

const AdminMeals = ({ filterMeals, handleFilterMeals }) => {
  return (
    <div className="admin-meals">
      <DashboardNav />
      <h1 className="admin-title">Meals</h1>
      <div className="meals-list">
        {filterMeals.map((meal, i) =>
          <MealView key={i} meal={meal} handleOnClick={() => appState.pickMeal(meal.id)}/>
        )}
      </div>
    </div>
  );
}

export default withDashboadLayout(() => <AdminMeals {...adminMealsState}/>);