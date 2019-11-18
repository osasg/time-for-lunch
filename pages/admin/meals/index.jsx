import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Link from 'next/link';
import to from 'await-to-js';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AdminHead from '../../../components/AdminHead';
import MealView from '../../../components/MealView';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';

import AddResourceIcon from '../../../public/icons/add-resource.svg';

class AdminMealsState {
  @observable searchStr = '';
  @observable meals = null;
  @observable isReadyToUpdate = false;
}

const state = new AdminMealsState();

const AdminMeals = observer((props) => {
  runInAction(() => {
    if (props.meals && !state.meals)
      state.meals =  props.meals || [];
  });

  const newMeal = (
    <Link href="/admin/meals/new"><a className="new-btn">
      <AddResourceIcon />
    </a></Link>
  );

  const [ searchMeals, { error, loading, data }] = useLazyQuery(gql`
    query SearchMeals($pattern: String = "", $page: Int = 0, $perPage: Int = 20) {
      meals(search: { pattern: $pattern, page: $page, perPage: $perPage }) {
        _id
        name
        imageUrl
      }
    }
  `);

  if (loading)
    return <></>;

  if (data && state.isReadyToUpdate) {
    state.meals = data.meals;
    state.isReadyToUpdate = false;
  }

  if(!data && !state.meals) {
    state.isReadyToUpdate = true;
    searchMeals({ variables: { pattern: '' } });
  }

  return (
    <DashboardLayout>
      <div className="admin-meals">
        <DashboardNav currentBoard="Meals" />
        <AdminHead
          searchable={true}
          newResourceBtn={newMeal}
          headName="Meals"
          handleSearchResources={() => searchMeals({ variables: { pattern: searchStr } })}
          parentState={state}
        />
        <div className="meals-list resources-list">
          {state.meals && state.meals.map((meal, i) =>
            <Link key={i} href={`/admin/meals/${meal._id}`}>
              <a><MealView meal={meal} handleOnClick={e => e.preventDefault()} /></a>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
});

AdminMeals.getInitialProps = async ({ req, res }) => {
  if (req) {
    const [ err, meals ] = await to(req.repos.Meal.search({ pattern: '', page: 0, perPage: 20 })) || [];
    if (err)
      return {};

    return { meals };
  }
  return {};
}

export default AdminMeals;