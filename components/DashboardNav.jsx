import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import WhiteHomeIcon from '../public/icons/white-home.svg';
import WhiteMealsIcon from '../public/icons/white-meals.svg';
import WhiteUsersIcon from '../public/icons/white-users.svg';
import WhiteTodayLunchIcon from '../public/icons/white-today-lunch.svg';
import WhiteAnalystIcon from '../public/icons/white-analyst.svg';
import WhiteDeliveryIcon from '../public/icons/white-delivery.svg';

import HomeIcon from '../public/icons/home.svg';
import MealsIcon from '../public/icons/meals.svg';
import UsersIcon from '../public/icons/users.svg';
import TodayLunchIcon from '../public/icons/today-lunch.svg';
import AnalystIcon from '../public/icons/analyst.svg';
import DeliveryIcon from '../public/icons/delivery.svg';

const icons = {
  WhiteHomeIcon,
  WhiteMealsIcon,
  WhiteUsersIcon,
  WhiteTodayLunchIcon,
  WhiteAnalystIcon,
  WhiteDeliveryIcon,
  HomeIcon,
  MealsIcon,
  UsersIcon,
  TodayLunchIcon,
  AnalystIcon,
  DeliveryIcon
};

const Control = ({ currentBoard }) => {
  return (
    <div className="control">
      {['Home', 'Meals', 'Users', 'TodayLunch', 'Analyst','Delivery'].map((v, i) => {
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
      <Link href="/lunch">
        <a>
          <div className="d-logo">
            <div className="d-logo__chars">
              <span>L</span>
              <span>U</span>
              <span>N</span>
              <span>C</span>
              <span>H</span>
            </div>
          </div>
        </a>
      </Link>
      <Control currentBoard={currentBoard} />
    </div>
  );
}

DashboardNav.propTypes = {
  currentBoard: PropTypes.oneOf(['Home', 'Meals', 'Users', 'TodayLunch', 'Analyst','Delivery']).isRequired
}

export default DashboardNav;