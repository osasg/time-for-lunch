import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';

import TopNav from '../components/TopNav';
import MealView from '../components/MealView';
import SearchBox from '../components/SearchBox';

import RemoveIcon from '../public/icons/remove.svg';

@inject(['appState'])
@observer
class Lunch extends React.Component {
  @observable filteredMeals = [];

  @action handleSearch = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filteredMeals = this.props.appState.todayMeals.filter(m =>
      m.name.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }

  componentDidMount() {
    runInAction(() => {
      this.filteredMeals = this.props.appState.todayMeals;
      console.log(this.filteredMeals, this.props.appState.todayMeals)
    });
  }

  render() {
    const {
      currentUser,
      todayPick, todayMeals, previousPicks,
      lunchStatus, isLocked, isConfirmed,
      pickMeal, unPickMeal, confirm
    } = this.props.appState;

    const pickedMeal = todayMeals.find(({ id }) => id === todayPick);

    const searchingArea = isLocked
      ? <div className="locked">You are being locked!</div>
      : <SearchBox handleSearch={this.handleSearch}/>
      ;

    const todayPickArea = pickedMeal
      ? <div className="today-pick">
          <div className="picked__title">Today pick</div>
          <div className="today-pick__image-wrapper">
            <img className="today-pick__image" src={pickedMeal.imageSrc} alt="Picked meal image" />
            {lunchStatus === 'ORDERING' && <div className="today-pick__remove" onClick={unPickMeal}><RemoveIcon /></div>}
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

    return (
      <div className="lunch">
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
                      <button className="btn btn__confirm-meal" onClick={confirm}>Confirm</button>
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
        <div className="todaymeals-list">
          {!isLocked && this.filteredMeals.map((meal, i) =>
            <MealView key={i} meal={meal} handleOnClick={() => pickMeal(meal.id)}/>
          )}
        </div>
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
  }
};

export default Lunch;