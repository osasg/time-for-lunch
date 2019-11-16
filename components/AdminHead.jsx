import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import SearchIcon from '../public/icons/search.svg';

@observer class AdminHead extends React.Component {
  constructor(props) {
    super(props);

    this.searchTxt = React.createRef();
    this.searchBtn = React.createRef();
  }

  @action handleOnKeyUp = e => {
    if (e.keyCode === 13) {
      this.props.parentState.isReadyToUpdate = true;
      this.props.handleSearchResources();
    } else {
      this.props.parentState.searchStr = e.currentTarget.value;
    }
  }

  handleToggleSearch = e => {
    e.currentTarget.classList.add('open-search');
    setTimeout(() =>
      this.searchTxt.current.classList.add('open-search')
        || this.searchTxt.current.focus()
    , 200);
  }

  handleWindowOnKeyUp = e => {
    if (!this.searchBtn.current || this.searchBtn.current.classList.contains('open-search'))
      return;

    if (e.keyCode === 83) {
      this.searchBtn.current.click();
    }
  }

  componentDidMount() {
    if(!this.props.searchable)
      return;

    this.props.parentState.searchStr
      && this.searchTxt.current.focus();

    window.addEventListener('keyup', this.handleWindowOnKeyUp);
  }

  componentWillUnmount() {
    if(!this.props.searchable)
      return;

    window.removeEventListener('keyup', this.handleWindowOnKeyUp);
  }

  render() {
    const { headName, parentState, searchable = true, newResourceBtn, parrentState } = this.props;
    return (
      <div className="admin-head">
        <h1 className="admin-title">
          {headName}
          {newResourceBtn}
        </h1>
        {
          searchable
          && <>
            <input
              onKeyUp={this.handleOnKeyUp}
              ref={this.searchTxt}
              className={classnames('search-txt', { 'open-search': !!parentState.searchStr })}
              type="text"
              defaultValue={parentState.searchStr}
            />
            <div
              ref={this.searchBtn}
              className={classnames('search-btn', { 'open-search': !!parentState.searchStr })}
              onClick={this.handleToggleSearch}
            >
              <SearchIcon />
            </div>
          </>
        }
      </div>
    );
  }
};

AdminHead.propTypes = {
  searchable: PropTypes.bool,
  parentState: PropTypes.object,
  handleSearchResources: PropTypes.func,
  newResourceBtn: PropTypes.element,
  headName: PropTypes.string.isRequired
}

export default AdminHead;