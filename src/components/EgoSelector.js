/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { toPairs } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import SelectorDragHandle from './SelectorDragHandle';

const operators = {
  GREATER_THAN: 'Greater than',
  GREATER_THAN_OR_EQUAL: 'Greater than or exactly',
  LESS_THAN: 'Less than',
  LESS_THAN_OR_EQUAL: 'Less than or exactly',
  EXACTLY: 'Exactly',
  NOT: 'Not',
  EXISTS: 'Exists',
};

const nodeAttributes = [
  'name',
  'nick',
];

const EgoSelector = ({ id, onChangeOption, options: { operator, attribute, value } }) => (
  <div className="selector">
    <SelectorDragHandle />
    <form>
      <label>
        Attribute:
        <select defaultValue={attribute} onChange={event => onChangeOption(event, id, 'attribute')}>
          {nodeAttributes.map(
            (attributeOption, index) => (
              <option key={index} value={value}>{attributeOption}</option>
            ),
          )}
        </select>
      </label>
      <label>
        Operator:
        <select defaultValue={operator} onChange={event => onChangeOption(event, id, 'operator')}>
          {toPairs(operators).map(
            ([operatorOption, operatorLabel], index) => (
              <option key={index} value={operatorOption}>{operatorLabel}</option>
            ),
          )}
        </select>
      </label>
      <label>
        Value:
        <input type="text" value={value} onChange={event => onChangeOption(event, id, 'value')} />
      </label>
    </form>
  </div>
);

EgoSelector.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChangeOption: PropTypes.func,
  options: PropTypes.shape({
    operator: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.string,
  }),
};

EgoSelector.defaultProps = {
  options: {
    operator: null,
    attribute: null,
    value: '',
  },
  onChangeOption: () => {},
};

export default SortableElement(EgoSelector);
