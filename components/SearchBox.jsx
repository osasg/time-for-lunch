import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import PropTypes from 'prop-types';

import SearchIcon from '../public/icons/search.svg';

class SearchBox extends React.Component {
  handleSearch = e => {
    const value = e.currentTarget.value;
    const label = e.currentTarget.parentElement.firstChild;
    label.classList[value ? 'add' : 'remove']('form__label-txt--hidden');

    this.props.handleSearch(value);
  }

  render() {
    return (
      <div className="search-wrapper">
        <label htmlFor="search__input" className="search__label">Are you craving?</label>
        <input id="search__input" className="search__input" onChange={this.handleSearch} />
        <span className="search__icon"><SearchIcon /></span>
      </div>
    );
  }
}

SearchBox.propTypes = {
  handleSearch: PropTypes.func.isRequired
}

export default SearchBox;