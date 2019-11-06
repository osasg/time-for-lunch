import React from 'react';

export default function MealView({ meal, handleOnClick }) {
  return (
    <div className="meal">
      <div className="meal__image-wrapper">
        <img draggable={false} className="meal__image" src={meal.imageSrc} alt={meal.name} />
        <button className="btn btn__pick-meal" onClick={handleOnClick}>Pick</button>
      </div>
      <span className="meal__name">{meal.name}</span>
    </div>
  );
}