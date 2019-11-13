import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Router from 'next/router';

import AdminHead from '../../../components/AdminHead';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';
import MealFormBody from '../../../components/MealFormBody';

import RemoveIcon from '../../../public/icons/remove.svg';

import data from '../../../data-sample.json';

@observer
class AdminNewMeal extends React.Component {
  @observable meal = {
    imageSrc: ''
  };

  @action uploadImage = e => {
    const file = e.currentTarget.files[0];

    if (!file.type.includes('image/png'))
      return;

    this.meal.imageSrc = URL.createObjectURL(file);
  }

  requestSaveMeal = e => {
    e.preventDefault();
  }

  render() {
    const { meal, uploadImage, requestRemoveMeal, requestSaveMeal } = this;

    return (
      <DashboardLayout>
        <DashboardNav currentBoard="Meals" />
        <div className="meal-detail">
          <AdminHead headName={meal.name ? meal.name : 'New meal'} />
            <form className="form meal-form" onSubmit={requestSaveMeal}>
              <MealFormBody
                meal={meal}
                uploadImage={uploadImage}
                requestSaveMeal={requestSaveMeal}
              />
            </form>
        </div>
      </DashboardLayout>
    );
  }
}

export default AdminNewMeal;