import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Router from 'next/router';
import axios from 'axios';
import to from 'await-to-js';

import AdminHead from '../../../components/AdminHead';
import MealView from '../../../components/MealView';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';
import DashboardMealsSearch from '../../../components/DashboardMealsSearch';

import RemoveIcon from '../../../public/icons/remove.svg';

const statuses = {
  PREPARING: 'PREPARING',
  SUPSPENDING: 'SUPSPENDING',
  ORDERING: 'ORDERING',
  COOKING: 'COOKING',
  DELIVERING: 'DELIVERING'
}

const numberStatuses = [ statuses.PREPARING, statuses.SUPSPENDING, statuses.ORDERING, statuses.COOKING, statuses.DELIVERING ];

@observer class AdminLunchDetails extends React.Component {
  @observable lunch = {
    meals: [],
    status: this.props.lunchStatus
  };

  @action addTodayMeal = meal => {
    if (!this.lunch.meals.find(m => m._id === meal._id))
      this.lunch.meals.push(meal);
  }

  @action removeTodayMeal = _id => {
    this.lunch.meals = this.lunch.meals.filter(m => m._id !== _id);
  }

  @action requestUpdateStatus = async n => {
    const { lunch } = this;
    const lunchStatus = numberStatuses[numberStatuses.indexOf(lunch.status) + n];

    if (lunchStatus === statuses.SUPSPENDING) {
      const query = `
        mutation CreateLunch($meal_ids: [ID!]!, $date: String!) {
          createLunch(meal_ids: $meal_ids, date: $date) {
            _id
          }
        }
      `;

      const variables = {
        meal_ids: lunch.meals.map(({ _id }) => _id),
        date: lunch.date || '2019/11/12'
      };

      const [ err, res ] = await to(axios.post('/graphql', { query , variables }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }));

      if (err)
        return console.error(err);

      Router.push('/admin/lunches/' + res.data.data.createLunch._id);
      return;
    }

    const [ err, res ] = await to(axios.post('/graphql', { query: `
      mutation UpdateLunchStatus {
        updateLunchStatus(_id: ${lunch._id}, status: ${lunchStatus}) {
          status
        }
      }
    `}));

    if (err)
      return console.error(err);

    lunch.status = res.data.data.lunch.status;
  }

  render() {
    const { lunch, addTodayMeal, removeTodayMeal, requestUpdateStatus } = this;

    const PreparingMealsList = observer(() =>
      <div className="render-meals">
        {lunch.meals.map(m =>
          <div key={m._id} className="today-pick">
            <div className="today-pick__image-wrapper">
              {m.imageSrc && <img className="today-pick__image" src={m.imageSrc} alt="Picked meal image" />}
              <div className="today-pick__remove" onClick={() => removeTodayMeal(m._id)}><RemoveIcon /></div>
            </div>
            <div className="today-pick__name">{m.name}</div>
          </div>
        )}
      </div>
    );

    const PickedMealsList = observer(() =>
      <div className="render-meals">
        {this.props.pickedMeals.map(m =>
          <div key={m._id} className="picked-meal">
            <div className="picked-meal__quantity">{m.quantity}</div>
            <div className="picked-meal__name">{m.name}</div>
          </div>
        )}
      </div>
    );

    let renderMeals;

    switch (lunch.status) {
      case statuses.PREPARING:
        renderMeals = <PreparingMealsList />;
        break;
      case statuses.SUPSPENDING:
      case statuses.ORDERING:
      case statuses.COOKING:
        renderMeals = <PickedMealsList />;
        break;
    }

    return (
      <DashboardLayout>
        <div className="admin-lunches">
          <DashboardNav currentBoard="Lunches" />
          <AdminHead headName="Lunches" searchable={false} />
          <div className="select-meal">
            <DashboardMealsSearch
              lunchStatus={lunch.status}
              handleAddTodayMeal={addTodayMeal}
              requestUpdateStatus={requestUpdateStatus}
            />
          </div>
          {renderMeals}
        </div>
      </DashboardLayout>
    );
  }
}

AdminLunchDetails.getInitialProps = async () => {
  return {
    lunchStatus: statuses.PREPARING
  };
}

export default AdminLunchDetails;