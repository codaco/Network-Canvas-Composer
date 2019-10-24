import React from 'react';
import PropTypes from 'prop-types';
import Rules from './Rules';

const Filter = ({ rules, join, codebook, onChange, openDialog, error }) => (
  <Rules
    rules={rules}
    join={join}
    onChange={onChange}
    openDialog={openDialog}
    codebook={codebook}
    error={error}
  />
);

Filter.propTypes = {
  onChange: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  rules: PropTypes.array,
  codebook: PropTypes.object.isRequired,
  join: PropTypes.string.isRequired,
  error: PropTypes.string,
};

Filter.defaultProps = {
  rules: [],
  error: null,
};

export { Filter };

export default Filter;
