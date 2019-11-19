import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, runInAction, extendObservable, computed } from 'mobx';
import classnames from 'classnames';
import to from 'await-to-js';
import axios from 'axios';

import TopNav from '../components/TopNav';
import MealView from '../components/MealView';
import SearchBox from '../components/SearchBox';

import RemoveIcon from '../public/icons/remove.svg';

@inject(['currentUser'])
@observer
class Index extends React.Component {
  static async getInitialProps({ req, currentUser }) {
    currentUser.requireAuth();

    if (req) {
      const [ err, timeForLunch ] = await to(req.repos.Lunch.findLunchForToday());
      if (!timeForLunch)
        return {};

      const { lunch, previousPicks } = timeForLunch;
      return { lunch, previousPicks };
    }

    const [ err, res ] = await to(axios.post('/graphql', {
      query: `
        {
          timeForLunch {
            previousPicks {
              _id, name
            }
            lunch {
              _id, status, date
              meals {
                meal_id, name, imageUrl
                pickers {
                  account_id, isConfirmed
                }
              }
            }
          }
        }
      `
    }));

    if (err) {
      console.error(err);
      return {};
    }

    if (!res.data.data.timeForLunch)
      return {};

    const { lunch, previousPicks } = res.data.data.timeForLunch;
      return { lunch, previousPicks };
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
      lunch: props.lunch || {},
      previousPicks: props.previousPick || [],
      isBlocked: false,
      filteredMeals: []
    });
  }

  @action requestPickMeal = async m_id => {
    if (this.isBlocked || this.lunch.status !== 'ORDERING')
      return;

    this.lunch.status = 'LOCKED';
    const [ err, res ] = await to(axios.post('/graphql', {
      query: `
        mutation PickLunch($meal_id: ID, $_id: ID!) {
          pickLunch(meal_id: $meal_id, _id: $_id) {
            status
            meals {
              meal_id, name, imageUrl
              pickers {
                account_id, isConfirmed
              }
            }
          }
        }
      `,
      variables: { meal_id: m_id, _id: this.lunch._id }
    }));

    if (err)
      return console.error(err);

    const { meals, status } = res.data.data.pickLunch;
    this.lunch.meals = meals;
    this.lunch.status = status;
  }

  @action requestConfirmMeal = async () => {
    const [ err, res ] = await to(axios.post('/graphql', {
      query: `
        mutation ConfirmLunch {
          confirmLunch(_id: "${this.lunch._id}") {
            meals {
              meal_id, name, imageUrl
              pickers {
                account_id, isConfirmed
              }
            }
            status
          }
        }
      `
    }))

    if (err)
      return console.error(err);

    const { meals, status } = res.data.data.confirmLunch;
    this.lunch.meals = meals;
    this.lunch.status = status;
  }

  @action handleSearch = str => {
    const strToFilter = str.toLowerCase().split(/\s/).join('');
    this.filteredMeals = this.lunch.meals.filter(m =>
      m.name.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }

  componentDidMount() {
    runInAction(() => {
      if (this.lunch && this.lunch.meals)
        this.filteredMeals = this.lunch.meals;
    });
  }

  render() {
    const {
      lunch, isBlocked,
      previousPicks,
      requestPickMeal, requestConfirmMeal,
      filteredMeals,
      handleSearch
    } = this;

    const todayPick = lunch && lunch.meals
      ? lunch.meals
        .find(m => m.pickers
          .find(p => p.account_id === this.props.currentUser._id))
      : null;

    const isConfirmed = todayPick && todayPick.pickers
      ? todayPick.pickers.find(p => p.account_id === this.props.currentUser._id).isConfirmed
      : false;

    const searchingArea = isBlocked
      ? <div className="locked">You are being locked!</div>
      : <SearchBox handleSearch={handleSearch}/>
      ;

    const todayPickArea = todayPick
      ? <div className="today-pick">
          <div className="picked__title">Today pick</div>
          <div className="today-pick__image-wrapper">
            <img className="today-pick__image" src={todayPick.imageUrl} alt="Picked meal image" />
            {lunch.status === 'ORDERING' && <div className="today-pick__remove" onClick={() => requestPickMeal(null)}><RemoveIcon /></div>}
          </div>
          <div className="today-pick__name">{todayPick.name}</div>
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
      <div className="time-for-lunch">
        <TopNav />
        {
          todayPick
          && lunch.status === 'DELIVERING'
          && <>
            <div className="confirm">
              <div className="confirm__message">{!isConfirmed && 'Your lunch is ready!'}</div>
              <div className="confirm__meal">
                <img className="confirm__meal-image" src={todayPick.imageUrl} alt="TodayPick" />
                <div className="confirm__meal-answer-tab">
                  {!isConfirmed
                  ? <>
                      <div className="confirm__question">
                        Have you eaten <span className="confirm__meal-name">{todayPick.name}</span> yet?
                      </div>
                      <button className="btn btn__confirm-meal" onClick={requestConfirmMeal}>Confirm</button>
                    </>
                  : <>
                      <span className="confirm__meal-name">{todayPick.name}</span>
                      <div className="confirm__confirmed">Comfirmed</div>
                    </>}
                </div>
              </div>
            </div>
          </>
        }
        <div className={classnames('search', { 'hidden': lunch.status === 'DELIVERING' })}>
          {searchingArea}
          {lunch.status !== 'ORDERING' && <div className="system-locked">System has locked</div>}
        </div>
        <div className="picked">
          {todayPickArea}
          <div className="previous-picks">
            <div className="picked__title">Previous</div>
            {previousPicks.map((p, i) =>
              <div key={p._id} className="previous-picks__image-wrapper">
                <img className="previous-picks__image" src={p.imageUrl} alt="Previous picked" />
              </div>
            )}
          </div>
        </div>
        <div className={classnames({ "todaymeals-list": true, "half-opacity": lunch.status !== 'ORDERING', 'hidden': lunch.status === 'DELIVERING' })}>
          {
            !isBlocked && filteredMeals &&
              filteredMeals.map(m =>
                <MealView key={m._id} meal={m} handleOnClick={() => requestPickMeal(m.meal_id)}/>
          )}
        </div>
      </div>
    );
  }
};

export default Index;