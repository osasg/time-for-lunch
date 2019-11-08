import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Link from 'next/link';

import AdminHead from '../../../components/AdminHead';
import MealView from '../../../components/MealView';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';

import data from '../../../data-sample.json';

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
          <DashboardNav currentBoard="Meals" />
          <AdminHead headName="Meals" handleFilterResources={handleFilterMeals} searchStr={searchStr} />
          <div className="meals-list resources-list">
            {filteredMeals.map((meal, i) =>
              <Link key={i} href={`/admin/meals/${meal.id}`}>
                <a><MealView meal={meal} handleOnClick={() => {}} /></a>
              </Link>
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