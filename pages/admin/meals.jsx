import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';

import AdminHead from '../../components/AdminHead';
import MealView from '../../components/MealView';
import DashboardNav from '../../components/DashboardNav';
import DashboardLayout from '../../components/DashboardLayout';

import data from '../../data-sample.json';

@observer class AdminMeals extends React.Component {
  @observable searchStr = '';
  @observable filteredMeals = data.todayMeals;

  @action handleFilterMeals = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filteredMeals = this.props.meals.filter(m =>
      m.name.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }

  componentDidMount() {
    runInAction(() => {
      const { meals, filteredMeals } = this.props;
      this.filteredMeals = meals;
    });
  }

  render() {
    const { searchStr, filteredMeals, handleFilterMeals } = this;
    return (
      <DashboardLayout>
        <div className="admin-meals">
          <DashboardNav />
          <AdminHead headName="Meals" handleFilterMeals={handleFilterMeals} searchStr={searchStr} />
          <div className="meals-list">
            {filteredMeals.map((meal, i) =>
              <MealView key={i} meal={meal} handleOnClick={() => {}} />
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

AdminMeals.getInitialProps = async () => {
  return {
    meals: data.todayMeals
  };
}

export default AdminMeals;