import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';

import SearchIcon from '../public/icons/search.svg';

@observer class DashboardMealsSearch extends React.Component {
  @observable searchStr = '';
  @observable filteredMeals = [];
  searchList = React.createRef();

  @action handleSearch = str => {
    if (!str) {
      this.filteredMeals = [];
      this.searchList.current.classList.add('hidden');
      return;
    }

    const strToFilter = str.toLowerCase().split(/\s/).join('');

    this.searchList.current.classList.remove('hidden');
    this.filteredMeals = this.props.meals.filter(m =>
      m.name.toLowerCase().split(/\s/).join('').includes(strToFilter));
  }

  render() {
    return (
      <div className="d-meals-search">
        <div className="dms-search">
          <SearchBox handleSearch={this.handleSearch} />
          <div ref={this.searchList} className="dms-search__list hidden">
            {this.filteredMeals.length > 0
              ? this.filteredMeals.map(m =>
                <div className="dms-search__name">{m.name}</div>)
              : <div className="dms-search__name">NOT FOUND</div>
            }
          </div>
        </div>
        <button className="btn btn__lunch-status">Lunch</button>
      </div>
    );
  }
}

DashboardMealsSearch.propTypes = {
  meals: PropTypes.array.isRequired
}

export default DashboardMealsSearch;