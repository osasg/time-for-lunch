import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import WhiteHomeIcon from '../static/icons/white-home.svg';
import WhiteMealsIcon from '../static/icons/white-meals.svg';
import WhiteUsersIcon from '../static/icons/white-users.svg';
import WhiteTodayMealsIcon from '../static/icons/white-today-meals.svg';
import WhiteAnalystIcon from '../static/icons/white-analyst.svg';
import WhiteDeliveryIcon from '../static/icons/white-delivery.svg';

import HomeIcon from '../static/icons/home.svg';
import MealsIcon from '../static/icons/meals.svg';
import UsersIcon from '../static/icons/users.svg';
import TodayMealsIcon from '../static/icons/today-meals.svg';
import AnalystIcon from '../static/icons/analyst.svg';
import DeliveryIcon from '../static/icons/delivery.svg';

const icons = {
  WhiteHomeIcon,
  WhiteMealsIcon,
  WhiteUsersIcon,
  WhiteTodayMealsIcon,
  WhiteAnalystIcon,
  WhiteDeliveryIcon,
  HomeIcon,
  MealsIcon,
  UsersIcon,
  TodayMealsIcon,
  AnalystIcon,
  DeliveryIcon
};

const Control = ({ currentBoard }) => {
  return (
    <div className="control">
      {['Home', 'Meals', 'Users', 'TodayMeals', 'Analyst','Delivery'].map((v, i) => {
        const BoardIcon = icons[(currentBoard === v ? '' : 'White') + v + 'Icon'];

        return (
          <Link key={i} href={`/admin/${v.toLowerCase()}`}><a>
            <div className={`control__tab ${currentBoard === v ? 'control__tab--current' : ''}`}>
              <BoardIcon />
            </div>
          </a></Link>
        );
      })}
    </div>
  );
}

const DashboardNav = ({ currentBoard }) => {
  return (
    <div className="dashboard-nav">
      <div className="d-logo">
        <div className="d-logo__chars">
          <span>L</span>
          <span>U</span>
          <span>N</span>
          <span>C</span>
          <span>H</span>
        </div>
      </div>
      <Control currentBoard={currentBoard} />
    </div>
  );
}

DashboardNav.propTypes = {
  currentBoard: PropTypes.oneOf(['Home', 'Meals', 'Users', 'TodayMeals', 'Analyst','Delivery']).isRequired
}

export default DashboardNav;