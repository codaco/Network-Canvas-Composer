/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const RuleInput = ({
  value,
  onChange,
  className,
}) => (
  <label className={cx('rule-input', className)}>
    <div className="rule-input__spacer">{ value }</div>
    <input
      className="rule-input__text"
      type="text"
      value={value}
      onChange={onChange}
    />
  </label>
);

RuleInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

RuleInput.defaultProps = {
  className: null,
  value: '',
};

export default RuleInput;
