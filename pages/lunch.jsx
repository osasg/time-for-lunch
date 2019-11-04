import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';

import TopNav from '../components/TopNav';
import MealView from '../components/MealView';
import SearchIcon from '../static/icons/search.svg';
import RemoveIcon from '../static/icons/remove.svg';

const searchState = observable({
  text: ''
});

function handleSearch(e) {
  const value = e.currentTarget.value;
    const label = e.currentTarget.parentElement.firstChild;

    runInAction(() => {
      searchState.text = value;
    });
    label.classList[value ? 'add' : 'remove']('form__label-txt--hidden');
}

const Lunch = inject(['appState'])(observer(({ appState }) => {
  const { currentUser, todayPick, todayMeals, previousPicks } = appState;
  const pickedMeal = todayMeals.find(({ id }) => id === todayPick);

  return (
    <div className="lunch" style={{ gridTemplateRows: `auto repeat(${Math.ceil(todayMeals.length / 3) + 1}, 209px)` }}>
      <TopNav />
      <div className="search">
        <div className="search-wrapper">
          <label htmlFor="search__input" className="search__label">Are you craving?</label>
          <input id="search__input" className="search__input" onChange={handleSearch} defaultValue={searchState.text} />
          <span className="search__icon"><SearchIcon /></span>
        </div>
      </div>
      <div className="picked">
        <div className="today-pick">
          <div className="picked__title">Today pick</div>
          <div className="today-pick__image-wrapper">
            <img className="today-pick__image" src={pickedMeal.imageSrc} alt="Picked meal image" />
            <div className="today-pick__remove"><RemoveIcon /></div>
          </div>
          <div className="today-pick__name">{pickedMeal.name}</div>
        </div>
        <div className="previous-picks">
          <div className="picked__title">Previous</div>
          {previousPicks.map((p, i) =>
            <img key={i} className="previous-picks__image" src={p.imageSrc} alt="Previous picked" />
          )}
        </div>
      </div>
      {todayMeals.map((meal, i) => (
        <MealView key={i} meal={meal} />
      ))}
    </div>
  );
}));

export default Lunch;