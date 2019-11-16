import React from 'react';
import Link from 'next/link';

import withDashboardLayout from '../../components/WithDashboardLayout';
import DashboardNav from '../../components/DashboardNav';

import MealsIcon from '../../public/icons/meals.svg';
import UsersIcon from '../../public/icons/users.svg';
import TodayLunchIcon from '../../public/icons/today-lunch.svg';
import AnalystIcon from '../../public/icons/analyst.svg';
import DeliveryIcon from '../../public/icons/delivery.svg';

const icons = {
  MealsIcon,
  UsersIcon,
  TodayLunchIcon,
  AnalystIcon,
  DeliveryIcon
};

const Board = ({ name }) => {
  const BoardIcon = icons[name + 'Icon'];

  return (
    <Link href={`/admin/${name.toLowerCase()}`}>
      <a className="board" onClick={() => {}}>
        <div className="board__icon-wrapper"><BoardIcon /></div>
        <span className="board__name">{name}</span>
      </a>
    </Link>
  );
}

const AdminIndex = () => {
  return (
    <div className="admin-index">
      <DashboardNav currentBoard={'Home'} />
      <Board name="Meals"/>
      <Board name="Users"/>
      <Board name="TodayLunch"/>
      <Board name="Analyst"/>
      <Board name="Delivery"/>
    </div>
  );
}

export default withDashboardLayout(AdminIndex);