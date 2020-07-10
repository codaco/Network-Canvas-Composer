import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { compose, defaultProps } from 'recompose';
import withValidation from './Form/withValidation';

const getValue = (eventOrValue) => {
  if (!eventOrValue || !eventOrValue.target) {
    return eventOrValue;
  }

  const target = eventOrValue.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  return value;
};

/*
 * Interface mirroring that of Redux Form Field,
 * for compatablity with our input components, without the
 * pesky redux integration (relies on `onChange` and `value`).
 * Currently only the minimum required interface has been
 * implemented for our use-case.
 *
 * Redux Form Field API documentation:
 * https://redux-form.com/7.4.2/docs/api/field.md/
 */

class DetachedField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      valid: null,
      invalid: null,
      touched: false,
    };
  }

  handleChange = (eventOrValue) => {
    const value = getValue(eventOrValue);
    this.setState({ touched: true });
    this.validate(value);
    this.props.onChange(eventOrValue, value, this.props.value, this.props.name);
  }

  validate(value) {
    const { validate } = this.props;

    const errors = validate.reduce(
      (memo, rule) => {
        const result = rule(value);
        if (!result) { return memo; }
        return [...memo, result];
      },
      [],
    );

    const isValid = errors.length === 0;

    const meta = {
      error: errors.join(),
      valid: isValid,
      invalid: !isValid,
    };

    if (!isEqual(meta, this.state)) {
      this.setState(meta);
    }
  }

  render() {
    const {
      component: FieldComponent,
      onChange,
      validate,
      value,
      name,
      meta,
      ...props
    } = this.props;

    const input = {
      value,
      name,
      onChange: this.handleChange,
    };

    return (
      <FieldComponent
        {...props}
        input={input}
        meta={{
          ...meta,
          ...this.state,
        }}
      />
    );
  }
}

DetachedField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.any.isRequired,
  validate: PropTypes.array.isRequired,
  component: PropTypes.any.isRequired,
  meta: PropTypes.object.isRequired,
};

export default compose(
  defaultProps({ validation: {} }),
  withValidation,
)(DetachedField);
