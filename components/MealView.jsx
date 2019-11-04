import React from 'react';

export default function MealView({ meal }) {
  return (
    <div className="meal">
      <img className="meal__image" src={meal.imageSrc} alt={meal.name} />
      <span className="meal__name">{meal.name}</span>
    </div>
  );
}