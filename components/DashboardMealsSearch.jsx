import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';

@observer class DashboardMealsSearch extends React.Component {
  @observable searchStr = '';
  @observable filteredMeals = this.props.meals;
  @observable mousePoint = null;

  searchList = React.createRef();
  dmsSearch = React.createRef();

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

  @action handleMouseUpAndDown = e => {

  }

  hiddenSearchList = e => {
    this.searchList.current.classList.remove('hidden');
    e.stopPropagation();
  }

  visibleSearchList = e => {
    this.searchList.current.classList.add('hidden');
  }

  componentDidMount() {
    window.addEventListener('click', this.visibleSearchList);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.visibleSearchList);
  }

  render() {
    return (
      <div className="d-meals-search">
        <div ref={this.dmsSearch} className="dms-search" onClick={this.hiddenSearchList}>
          <SearchBox handleSearch={this.handleSearch} />
          <div ref={this.searchList} className="dms-search__list hidden">
            {this.filteredMeals.length > 0
              ? this.filteredMeals.map(m =>
                  <div key={m.id} className="dms-search__name">
                    <div>{m.name}</div>
                    <div className="dms-search__add" onClick={() => this.props.handleAddTodayMeal(m.id)}>Add</div>
                  </div>
                )
              : <div className="dms-search__name">- - - - - -</div>
            }
          </div>
        </div>
        <button className="btn btn__lunch-status">Lunch</button>
      </div>
    );
  }
}

DashboardMealsSearch.propTypes = {
  meals: PropTypes.array.isRequired,
  handleAddTodayMeal: PropTypes.func.isRequired
}

export default DashboardMealsSearch;