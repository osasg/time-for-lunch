import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

let pattern = observable.box('');

const DMSList = observer(({ searchStr, handleAddTodayMeal }) => {
  const empty =
    <div className="dms-search__list">
      <div className="dms-search__name">- - - - - -</div>
    </div>
  ;
  const [ searchMeals, { error, loading, data } ] = useLazyQuery(gql`
    query SearchMeals($pattern: String = "", $page: Int = 0, $perPage: Int = 20) {
      meals(search: { pattern: $pattern, page: $page, perPage: $perPage }) {
        _id
        name
        imageUrl
      }
    }
  `);

  if (pattern != searchStr) {
    searchMeals({ variables: { pattern: searchStr } });
    pattern = searchStr;
  }

  if (loading)
    return empty;

  if (error) {
    console.log(error);
  }

  if (data)
    return (
      <div className="dms-search__list">
        {data.meals && data.meals.length > 0
          ? data.meals.map(m =>
              <div key={m._id} className="dms-search__name">
                <div>{m.name}</div>
                <div className="dms-search__add" onClick={() => handleAddTodayMeal(m)}>Add</div>
              </div>
            )
          : <div className="dms-search__name">- - - - - -</div>
        }
      </div>
    );

  return empty;
});

DMSList.propTypes = {
  searchStr: PropTypes.string.isRequired,
  handleAddTodayMeal: PropTypes.func.isRequired
}

export default DMSList;