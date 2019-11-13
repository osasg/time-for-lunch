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
class AdminMealDetails extends React.Component {
  @observable meal = {
    name: '',
    imageSrc: ''
  };

  componentDidMount() {
    this.meal = this.props.meal;
  }

  @action uploadImage = e => {
    const file = e.currentTarget.files[0];

    if (!file.type.includes('image/png'))
      return;

    this.meal.imageSrc = URL.createObjectURL(file);
  }

  requestRemoveMeal = () => {

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
  }
}

AdminMealDetails.getInitialProps = async context => {
  const { id } = context.query;

  return { meal: data.todayMeals.find(m => m.id === parseInt(id)) };
}

export default AdminMealDetails;