/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const ShowRoute = ({ component: Component, path, location, ...rest }) => (
  <Route path={path} location={location}>
    {props => <Component {...props} {...rest} show={!!props.match} />}
  </Route>
);

ShowRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default ShowRoute;
