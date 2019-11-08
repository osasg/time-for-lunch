import React from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable, action, runInAction } from 'mobx';
import Router from 'next/router';

import AdminHead from '../../../components/AdminHead';
import MealView from '../../../components/MealView';
import DashboardNav from '../../../components/DashboardNav';
import DashboardLayout from '../../../components/DashboardLayout';

import RemoveIcon from '../../../public/icons/remove.svg';

import data from '../../../data-sample.json';

@observer
class AdminMealDetails extends React.Component {
  @observable meal = {
    imageSrc: ''
  };

  @action uploadImage = e => {
    const file = e.currentTarget.files[0];

    if (!file.type.includes('image/png'))
      return;

    this.meal.imageSrc = URL.createObjectURL(file);
  }

  removeMeal = () => {

  }

  render() {
    const { meal } = this.props;

    return (
      <DashboardLayout>
        <DashboardNav currentBoard="Meals" />
        <div className="meal-detail">
          <AdminHead headName={meal.name ? meal.name : 'New meal'} />
            <form className="form meal-form">
              <div className="meal-form__remove">
                <button className="btn btn--remove" onClick={this.removeMeal}>
                  <RemoveIcon /><span>Remove</span>
                </button>
              </div>
              <div className="meal-form__body">
                <div className="meal-form__image-wrapper">
                  <img className="meal-form__image" src={this.meal.imageSrc} />
                  <div className="upload-btn-wrapper">
                    <button className="btn btn--update">Choose image</button>
                    <input type="file" name="meal[image]" onChange={this.uploadImage} accept="image/x-png,image/jpeg" />
                  </div>
                </div>
                <div className="meal-form__info">
                  <label className="form__input-group" htmlFor="form__meal-name">
                    <p>Name</p>
                    <input type="text" name="meal[name]" id="form__meal-name" className="form__input" />
                  </label>
                  <div className="form__btn-group">
                    <button type="submit" className="btn btn--update">Save</button>
                    <button className="btn btn--cancel" onClick={() => Router.push('/admin/meals')}>Cancel</button>
                  </div>
                </div>
              </div>
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