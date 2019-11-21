import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Router from 'next/router';
import to from 'await-to-js';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import axios from 'axios';

import AdminHead from '../../../components/AdminHead';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';
import MealFormBody from '../../../components/MealFormBody';

import RemoveIcon from '../../../public/icons/remove.svg';

class AdminMealDetailsState {
  @observable meal = {};

  @action uploadImage = e => {
    const file = e.currentTarget.files[0];

    if (!file.type.includes('image'))
      return;

    this.meal.image = file;
    this.meal.imageUrl = URL.createObjectURL(file);
  }

  requestRemoveMeal = async e => {
    e.preventDefault();
    const { _id } = this.meal;

    const [ err, res ] = await to(axios.post('/graphql', {
      query: `
        mutation RemoveMeal {
          removeMeal(_id: "${_id}")
        }
      `
    }));

    if (err)
      return console.error(err);

    Router.push('/admin/meals');
  }

  requestSaveMeal = async e => {
    e.preventDefault();
    const { _id, name, image = {} } = this.meal;

    const query = `
      mutation UpdateMeal($name: String!, $image: Upload!) {
        updateMeal(_id: "${_id}", name: $name, image: $image)
      }
    `
    const [ err, res ] = await to(axios.post('/graphql', { query, variables: { name, image } }));

    if (err)
      return console.error(err);

    Router.push('/admin/meals');
  }
}

const state = new AdminMealDetailsState();

const AdminMealDetails = observer((props) => {
  if (props.meal && !state.meal.name) {
    state.meal = props.meal;
  }

  const { meal, uploadImage, requestRemoveMeal, requestSaveMeal } = state;
  if (!meal.name) {
    const { loading, error, data } = useQuery(gql`
      {
        findMealById(_id: "${meal._id}") {
          name
          imageUrl
        }
      }
    `);

    if (error)
      console.error(error);

    if (data) {
      runInAction(() => {
        state.meal = data;
      });
    }
  }

  return (
    <DashboardLayout>
      <DashboardNav currentBoard="Meals" />
      <div className="meal-detail">
        <AdminHead searchable={false} headName={meal._id ? meal.name : 'New meal'} />
          <form className="form meal-form" onSubmit={requestSaveMeal}>
            <div className="meal-form__remove">
              <button className="btn btn--remove" onClick={requestRemoveMeal}>
                <RemoveIcon /><span>Remove</span>
              </button>
            </div>
            <MealFormBody
              meal={meal}
              uploadImage={uploadImage}
              requestSaveMeal={requestSaveMeal}
            />
          </form>
      </div>
    </DashboardLayout>
  );
});

AdminMealDetails.getInitialProps = async ({ req, query }) => {
  const { _id } = query;
  if (req) {
    const [ err, meal ] = await to(req.repos.Meal.findById({ _id }));
    if (err)
      return {};

    return { meal };
  }

  return {};
}

export default AdminMealDetails;