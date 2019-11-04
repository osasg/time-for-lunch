import React from 'react';

export default function MealView({ meal }) {
  return (
    <div className="meal">
      <div className="meal__image-wrapper">
        <img className="meal__image" src={meal.imageSrc} alt={meal.name} />
      </div>
      <span className="meal__name">{meal.name}</span>
    </div>
  );
}