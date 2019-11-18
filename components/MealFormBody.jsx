import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import Router from 'next/router';
import PropTypes from 'prop-types';

const MealFormBody = observer(({ meal, uploadImage }) =>
  <div className="meal-form__body">
    <div className="meal-form__image-wrapper">
      <img className="meal-form__image" src={meal.imageUrl} />
      <div className="upload-btn-wrapper">
        <button className="btn btn--update">Choose image</button>
        <input type="file" name="meal[image]" onChange={uploadImage} accept="image/x-png,image/jpeg" />
      </div>
    </div>
    <div className="meal-form__info">
      <label className="form__input-group" htmlFor="form__meal-name">
        <p>Name</p>
        <input onChange={e => meal.name = e.currentTarget.value} type="text" name="meal[name]" id="form__meal-name" className="form__input" defaultValue={meal.name} />
      </label>
      <div className="form__btn-group">
        <button type="submit" className="btn btn--update">Save</button>
        <button className="btn btn--cancel" onClick={() => Router.push('/admin/meals')}>Cancel</button>
      </div>
    </div>
  </div>
)

MealFormBody.propTypes = {
  meal: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired
}

export default MealFormBody;