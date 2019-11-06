import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';

import TopNav from '../components/TopNav';
import MealView from '../components/MealView';

import SearchIcon from '../public/icons/search.svg';
import RemoveIcon from '../public/icons/remove.svg';

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
  const { currentUser, todayPick, todayMeals, previousPicks, lunchStatus, isLocked, isConfirmed } = appState;
  const pickedMeal = todayMeals.find(({ id }) => id === todayPick);

  const searchingArea = isLocked
    ? <div className="locked">You are being locked!</div>

    : <div className="search-wrapper">
        <label htmlFor="search__input" className="search__label">Are you craving?</label>
        <input id="search__input" className="search__input" onChange={handleSearch} defaultValue={searchState.text} />
        <span className="search__icon"><SearchIcon /></span>
      </div>
    ;

  const todayPickArea = pickedMeal
    ? <div className="today-pick">
        <div className="picked__title">Today pick</div>
        <div className="today-pick__image-wrapper">
          <img className="today-pick__image" src={pickedMeal.imageSrc} alt="Picked meal image" />
          {lunchStatus === 'ORDERING' && <div className="today-pick__remove" onClick={appState.unPickMeal}><RemoveIcon /></div>}
        </div>
        <div className="today-pick__name">{pickedMeal.name}</div>
      </div>

    : <div className="today-pick">
        <div className="picked__title">Today pick</div>
        <div className="today-pick__image-wrapper"></div>
        <div className="today-pick__name"></div>
        <style jsx>{`
          .today-pick__name {
            width: 149px;
            height: 21px;
            border-bottom: 2px solid #e90b68;
          }
        `}</style>
      </div>
    ;

  const rows = (function () {
    if (lunchStatus === 'COMFIRMING')
      return 0;
    return Math.ceil(todayMeals.length / 3) + 1;
  })()

  return (
    <div className="lunch" style={{ gridTemplateRows: `auto repeat(${rows}, 209px)` }}>
      <TopNav />
      {
        lunchStatus === 'COMFIRMING'
        && <>
          <div className="confirm">
            <div className="confirm__message">{!isConfirmed && 'Your lunch is ready!'}</div>
            <div className="confirm__meal">
              <img className="confirm__meal-image" src={pickedMeal.imageSrc} alt="PickedMeal" />
              <div className="confirm__meal-answer-tab">
                {!isConfirmed
                ? <>
                    <div className="confirm__question">
                      Have you eaten <span className="confirm__meal-name">{pickedMeal.name}</span> yet?
                    </div>
                    <button className="btn btn__confirm-meal" onClick={appState.confirm}>Confirm</button>
                  </>
                : <>
                    <span className="confirm__meal-name">{pickedMeal.name}</span>
                    <div className="confirm__confirmed">Comfirmed</div>
                  </>}
              </div>
            </div>
          </div>
          <style jsx global>{`
            .search, .meal {
              display: none;
            }
          `}</style>
        </>
      }
      <div className="search">
        {searchingArea}
        {lunchStatus === 'LOCKED' && <div className="system-locked">System has locked</div>}
      </div>
      <div className="picked">
        {todayPickArea}
        <div className="previous-picks">
          <div className="picked__title">Previous</div>
          {previousPicks.map((p, i) =>
            <img key={i} className="previous-picks__image" src={p.imageSrc} alt="Previous picked" />
          )}
        </div>
      </div>
      {!isLocked && todayMeals.map((meal, i) =>
        <MealView key={i} meal={meal} handleOnClick={() => appState.pickMeal(meal.id)}/>
      )}
      {
        lunchStatus === 'LOCKED'
        && <style jsx global>{`
          .meal {
            opacity: .5;
          }
        `}</style>
      }
    </div>
  );
}));

export default Lunch;