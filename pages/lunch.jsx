import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction, extendObservable } from 'mobx';
import classnames from 'classnames';

import TopNav from '../components/TopNav';
import MealView from '../components/MealView';
import SearchBox from '../components/SearchBox';

import RemoveIcon from '../public/icons/remove.svg';

@inject(['currentUser'])
@observer
class Lunch extends React.Component {
  static async getInitialProps({ currentUser }) {
    currentUser.isAuth();
    return {};
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
      todayMeals: [],
      todayPick: null,
      previousPicks: [],
      isLocked: false,
      lunchStatus: '',
      isConfirm: false,
      filteredMeals: []
    });
  }

  @action pickMeal = m_id => {
    if (this.isLocked)
      return;

    this.todayPick = m_id;
    this.lunchStatus = 'LOCKED';
    setTimeout(() => {
      runInAction(() => this.lunchStatus = 'ORDERING');
    }, 1200);
  }

  @action unPickMeal = () => {
    this.todayPick = null;
  }

  @action confirm = () => {
    this.isConfirmed = true;
  }

  @action handleSearch = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filteredMeals = this.todayMeals.filter(m =>
      m.name.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }

  componentWillMount() {
    runInAction(() => {
      this.filteredMeals = this.todayMeals;
    });
  }

  render() {
    const {
      todayPick, todayMeals, previousPicks,
      lunchStatus, isLocked, isConfirmed,
      pickMeal, unPickMeal, confirm,
      filteredMeals,
      handleSearch
    } = this;

    const { currentUser } = this.props;
    const pickedMeal = todayMeals.find(({ id }) => id === todayPick);

    const searchingArea = isLocked
      ? <div className="locked">You are being locked!</div>
      : <SearchBox handleSearch={handleSearch}/>
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
              <div className="previous-picks__image-wrapper">
                <img key={i} className="previous-picks__image" src={p.imageSrc} alt="Previous picked" />
              </div>
            )}
          </div>
        </div>
        <div className={classnames({ "todaymeals-list": true, "half-opacity": lunchStatus === 'LOCKED' })}>
          {!isLocked && filteredMeals.map((meal, i) =>
            <MealView key={i} meal={meal} handleOnClick={() => pickMeal(meal.id)}/>
          )}
        </div>
      </div>
    );
  }
};

export default Lunch;