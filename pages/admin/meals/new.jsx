import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Router from 'next/router';
import axios from 'axios';
import to from 'await-to-js'

import { getDataUri } from '../../../utils/image.util';

import AdminHead from '../../../components/AdminHead';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';
import MealFormBody from '../../../components/MealFormBody';

import RemoveIcon from '../../../public/icons/remove.svg';

class AdminNewMealState {
  @observable meal = {
    name: '',
    imageUrl: ''
  };

  @action uploadImage = e => {
    const file = e.currentTarget.files[0];

    if (!file.type.includes('image/png'))
      return;

    this.meal.image = file;

    getDataUri(URL.createObjectURL(file), data => {
      this.meal.imageUrl = data;
    });
  }

  requestSaveMeal = async e => {
    e.preventDefault();

    const { name, image = {} } = this.meal;
    const query = `
      mutation CreateMeal($name: String!, $image: Upload!) {
        createMeal(name: $name, image: $image) {
          _id
        }
      }
    `
    const [ err, res ] = await to(axios.post('/graphql', { query, variables: { name, image } }));
    if (err)
      return console.error(err);

    Router.push('/admin/meals');
  }
}

const state = new AdminNewMealState();

const AdminNewMeal = observer(() => {
  const { meal, uploadImage, requestRemoveMeal, requestSaveMeal } = state;

  return (
    <DashboardLayout>
      <DashboardNav currentBoard="Meals" />
      <div className="meal-detail">
        <AdminHead searchable={false} headName={meal.name ? meal.name : 'New meal'} />
          <form className="form meal-form" onSubmit={requestSaveMeal}>
            <MealFormBody meal={meal} uploadImage={uploadImage} />
          </form>
      </div>
    </DashboardLayout>
  );
})

export default AdminNewMeal;