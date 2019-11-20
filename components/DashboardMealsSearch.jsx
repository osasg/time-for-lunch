import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import DMSList from './DMSList';

@observer class DashboardMealsSearch extends React.Component {
  @observable searchStr = '';

  searchList = React.createRef();

  hiddenSearchList = e => {
    this.searchList.current.classList.add('hidden');
  }

  visibleSearchList = e => {
    this.searchList.current.classList.remove('hidden');
    e.stopPropagation();
  }

  componentDidMount() {
    window.addEventListener('click', this.hiddenSearchList);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hiddenSearchList);
  }

  @action handleSearch = str => {
    if (!str)
      this.searchList.current.classList.add('hidden');

    this.searchList.current.classList.remove('hidden');
    this.searchStr = str;
  }

  render() {
    const { visibleSearchList, handleSearch, searchStr } = this;
    const { requestUpdateStatus, lunch, handleAddTodayMeal } = this.props;

    return (
      <div className="d-meals-search">
        <div className="dms-search" onClick={visibleSearchList}>
          <SearchBox handleSearch={handleSearch} />
          <div ref={this.searchList} className="dms-search__list-wrapper hidden">
            <DMSList searchStr={searchStr} handleAddTodayMeal={handleAddTodayMeal}  />
          </div>
        </div>
        <div className="dms-day-picker">
          <input type="date"
            disabled={lunch.status !== 'PREPARING'}
            defaultValue={lunch.date.split('/').join('-')}
            onChange={e => lunch.date = e.currentTarget.value.split('-').join('/')}
          />
        </div>
        <div className="dms-btn-group">
          {lunch.status !== 'PREPARING' && lunch.status !== 'DELIVERED' && <button className="btn btn--cancel" onClick={() => requestUpdateStatus(-1)}>Cancel</button>}
          <button className="btn btn__lunch-status" onClick={() => requestUpdateStatus(1)}>
            {{
              PREPARING: 'SAVE',
              SUSPENDING: 'ORDER',
              ORDERING: 'COOK',
              COOKING: 'DELIVERY',
              DELIVERING: 'DONE',
              DELIVERED: '----'
            }[lunch.status]}
          </button>
        </div>
      </div>
    );
  }
}

DashboardMealsSearch.propTypes = {
  handleAddTodayMeal: PropTypes.func.isRequired,
  requestUpdateStatus: PropTypes.func.isRequired,
  lunchStatus: PropTypes.string
}

export default DashboardMealsSearch;