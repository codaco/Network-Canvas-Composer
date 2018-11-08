import React from 'react';
import { components as ReactSelectComponents } from 'react-select';

const { Option } = ReactSelectComponents;

const SelectOptionVariable = props => (
  <Option
    {...props}
    className="form-fields-select__item"
    classNamePrefix="form-fields-select__item"
  >
    <h4>
      {props.data.label} <span className="select-item__variable--variable-name">&lt;{props.data.name}&gt;</span>
    </h4>
    <p>{props.data.description}</p>
  </Option>
);

export default SelectOptionVariable;