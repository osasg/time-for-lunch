import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Router from 'next/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import AdminHead from '../../../components/AdminHead';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';
import MealFormBody from '../../../components/MealFormBody';

import RemoveIcon from '../../../public/icons/remove.svg';

import data from '../../../data-sample.json';

class AdminNewMealState {
  @observable meal = {
    name: '',
    imageSrc: ''
  };

  @action uploadImage = e => {
    const file = e.currentTarget.files[0];

    if (!file.type.includes('image/png'))
      return;

    this.meal.imageSrc = URL.createObjectURL(file);
  }

  requestSaveMeal = async (e, createMeal) => {
    e.preventDefault();
    await createMeal();
    Router.push('/admin/meals');
  }
}

const state = new AdminNewMealState();

const AdminNewMeal = observer(() => {
  const { meal, uploadImage, requestRemoveMeal, requestSaveMeal } = state;
  const [ createMeal, { data, error } ] = useMutation(gql`
    mutation CreateNewMeal {
      createMeal(name: "${meal.name}", imageUrl: "${meal.imageSrc}") {
        name, imageUrl
      }
    }
  `);
  console.log(data, error);
  return (
    <DashboardLayout>
      <DashboardNav currentBoard="Meals" />
      <div className="meal-detail">
        <AdminHead searchable={false} headName={meal.name ? meal.name : 'New meal'} />
          <form className="form meal-form" onSubmit={e => requestSaveMeal(e, createMeal)}>
            <MealFormBody meal={meal} uploadImage={uploadImage} />
          </form>
      </div>
    </DashboardLayout>
  );
})

export default AdminNewMeal;