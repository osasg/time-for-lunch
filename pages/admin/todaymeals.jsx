import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';

import AdminHead from '../../components/AdminHead';
import MealView from '../../components/MealView';
import DashboardNav from '../../components/DashboardNav';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardMealsSearch from '../../components/DashboardMealsSearch';

import data from '../../data-sample.json';

import RemoveIcon from '../../public/icons/remove.svg';

@observer class AdminTodayMeals extends React.Component {
  @observable todayMeals = this.props.meals;
  @observable status = '';

  @action addTodayMeal = id => {
    if (!this.todayMeals.find(m => m.id === id))
      this.todayMeals.push(this.props.meals.find(m => m.id === id));
  }

  @action removeTodayMeal = id => {
    this.todayMeals = this.todayMeals.filter(m => m.id !== id);
  }

  render() {
    return (
      <DashboardLayout>
        <div className="admin-todaymeals">
          <DashboardNav currentBoard="TodayMeals" />
          <AdminHead headName="Today Meals" searchable={false} />
          <div className="select-meal">
            <DashboardMealsSearch meals={this.props.meals} handleAddTodayMeal={this.addTodayMeal} />
          </div>
          <div className="render-meals">
            {this.todayMeals.map(m =>
              <div key={m.id} className="today-pick">
                <div className="today-pick__image-wrapper">
                  <img className="today-pick__image" src={m.imageSrc} alt="Picked meal image" />
                  <div className="today-pick__remove" onClick={() => this.removeTodayMeal(m.id)}><RemoveIcon /></div>
                </div>
                <div className="today-pick__name">{m.name}</div>
              </div>
            )}
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