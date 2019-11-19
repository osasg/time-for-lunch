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
  SUSPENDING: 'SUSPENDING',
  ORDERING: 'ORDERING',
  COOKING: 'COOKING',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED'
}

const numberStatuses = [
  statuses.PREPARING,
  statuses.SUSPENDING,
  statuses.ORDERING,
  statuses.COOKING,
  statuses.DELIVERING,
  statuses.DELIVERED
];

@observer class AdminLunchDetails extends React.Component {
  @observable lunch = {
    _id: null,
    meals: [],
    status: statuses.PREPARING,
    date: ''
  };

  componentDidMount() {
    if (this.props.lunch)
      this.lunch = this.props.lunch;
  }

  @action addTodayMeal = meal => {
    if (this.lunch.status !== statuses.PREPARING)
      return;

    if (!this.lunch.meals.find(m => m._id === meal._id))
      this.lunch.meals.push(meal);
  }

  @action removeTodayMeal = _id => {
    if (this.lunch.status !== statuses.PREPARING)
      return;

    this.lunch.meals = this.lunch.meals.filter(m => m._id !== _id);
  }

  @action requestUpdateStatus = async n => {
    const { lunch } = this;
    const lunchStatus = numberStatuses[numberStatuses.indexOf(lunch.status) + n];
    if (!lunchStatus)
      return;
    if (lunch.status === statuses.DELIVERED)
      return;

    if (lunchStatus === statuses.SUSPENDING) {
      const query = lunch._id
      ? `
        mutation UpdateLunch($_id: ID!, $meal_ids: [ID!]!, $date: String!) {
          updateLunch(_id: $_id, meal_ids: $meal_ids, date: $date) {
            _id
          }
        }`
      : `
        mutation CreateLunch($meal_ids: [ID!]!, $date: String!) {
          createLunch(meal_ids: $meal_ids, date: $date) {
            _id
          }
        }`
      ;

      const variables = {
        _id: lunch._id,
        meal_ids: lunch.meals.map(({ _id }) => _id),
        date: lunch.date
      };

      const [ err, res ] = await to(axios.post('/graphql', { query , variables }));

      if (err)
        return console.error(err);

      Router.push('/admin/lunches/' + res.data.data[Object.keys(res.data.data)[0]]._id);
      return;
    }

    const [ err, res ] = await to(axios.post('/graphql', { query: `
      mutation UpdateLunchStatus {
        updateLunchStatus(_id: "${lunch._id}", status: "${lunchStatus}")
      }
    `}));

    if (err)
      return console.error(err);

    if (res.data.data.updateLunchStatus)
      lunch.status = lunchStatus;
  }

  render() {
    const { lunch, addTodayMeal, removeTodayMeal, requestUpdateStatus } = this;

    const PreparingMealsList = observer(() =>
      <div className="render-meals">
        {lunch.meals.map(m =>
          <div key={m._id} className="today-pick">
            <div className="today-pick__image-wrapper">
              {m.imageUrl && <img className="today-pick__image" src={m.imageUrl} alt="Picked meal image" />}
              <div className="today-pick__remove" onClick={() => removeTodayMeal(m._id)}><RemoveIcon /></div>
            </div>
            <div className="today-pick__name">{m.name}</div>
          </div>
        )}
      </div>
    );

    const PickedMealsList = observer(() =>
      <div className="render-meals">
        {lunch.meals.map(m =>
          <div key={m.meal_id} className="picked-meal">
            <div className="picked-meal__quantity">{m.pickers.length}</div>
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
      case statuses.SUSPENDING:
      case statuses.ORDERING:
      case statuses.COOKING:
      case statuses.DELIVERED:
      case statuses.DELIVERING:
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
              lunch={this.lunch}
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

AdminLunchDetails.getInitialProps = async ({ req, query }) => {
  const { _id } = query;
  if (req) {
    const [ err, lunch ] = await to(req.repos.Lunch.findById({ _id }));

    return { lunch };
  }

  return {};
}

export default AdminLunchDetails;