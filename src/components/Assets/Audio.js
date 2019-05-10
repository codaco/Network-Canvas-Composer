/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import withAssetUrl from './withAssetUrl';

const Audio = ({ url, description, dispatch, ...props }) =>
  <audio src={url} {...props}>{description}</audio>;

Audio.propTypes = {
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
};

Audio.defaultProps = {
  description: '',
};

export { Audio };

export default withAssetUrl(Audio);
