import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import SearchIcon from '../static/icons/search.svg';

@observer class AdminHead extends React.Component {
  constructor(props) {
    super(props);

    this.searchTxt = React.createRef();
    this.searchBtn = React.createRef();
  }

  @action handleToggleSearch = e => {
    if (e.currentTarget.classList.contains('open-search'))
      return this.props.handleFilterResources(this.searchTxt.current.value);

    e.currentTarget.classList.add('open-search');
    setTimeout(() =>
      this.searchTxt.current.classList.add('open-search')
      || this.searchTxt.current.focus()
    , 200);
  }

  componentDidMount = () => {
    this.searchTxt.current.addEventListener("keyup", () => this.searchBtn.current.click());
  }

  render() {
    const { headName, searchStr } = this.props;
    return (
      <div className="admin-head">
        <h1 className="admin-title">{headName}</h1>
        <input ref={this.searchTxt} className="search-txt" type="text" defaultValue={searchStr} />
        <div ref={this.searchBtn} className="search-btn" onClick={this.handleToggleSearch}>
          <SearchIcon />
        </div>
      </div>
    );
  }
};

AdminHead.propTypes = {
  headName: PropTypes.string.isRequired,
  searchStr: PropTypes.string,
  handleFilterResources: PropTypes.func
}

export default AdminHead;