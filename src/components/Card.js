import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import ControlBar from './ControlBar';
import { CardErrorBoundary } from './Errors/';
import window from '../ui/components/window';
import { getCSSVariableAsNumber } from '../utils/CSSVariables';

const fadeIn = {
  opacity: [0, 1],
  translateX: [0, 0],
};

const fadeOut = {
  opacity: [1, 0],
};

const wipeOut = {
  translateX: [0, '100%'],
};

class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.node),
    type: PropTypes.string,
    show: PropTypes.bool,
    style: PropTypes.oneOf(['fade', 'wipe']),
    enterDuration: PropTypes.number,
    enterDelay: PropTypes.number,
    exitDuration: PropTypes.number,
    exitDelay: PropTypes.number,
    onAcknowledgeError: PropTypes.func,
  };

  static defaultProps = {
    type: 'default',
    children: null,
    buttons: [],
    show: false,
    style: 'wipe',
    enterDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
    enterDelay: 0,
    exitDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
    exitDelay: 0,
    onAcknowledgeError: null,
  }

  get anyButtons() { return this.props.buttons.length > 0; }

  handleAcknowledgeError = () => this.props.onAcknowledgeError();

  render() {
    const {
      buttons,
      show,
      style,
      enterDuration,
      enterDelay,
      exitDuration,
      exitDelay,
    } = this.props;

    const classes = cx('card', `card--${this.props.type}`);
    const timeout = enterDuration + enterDelay + exitDuration + exitDelay;

    return (
      <Transition
        timeout={timeout}
        unmountOnExit
        mountOnEnter
        appear
        onEnter={
          (el) => {
            anime({
              targets: el,
              elasticity: 0,
              easing: 'easeInOutQuad',
              duration: enterDuration,
              delay: enterDelay,
              ...fadeIn,
            });
          }
        }
        onExit={
          (el) => {
            anime({
              targets: el,
              elasticity: 0,
              easing: 'easeInOutQuad',
              duration: exitDuration,
              delay: exitDelay,
              ...(style === 'wipe' ? wipeOut : fadeOut),
            });
          }
        }
        in={show}
      >
        {state => (
          <div className={classes}>
            <div className="card__container">
              <div className="card__content">
                <CardErrorBoundary onAcknowledge={this.handleAcknowledgeError}>
                  { show && this.props.children }
                </CardErrorBoundary>
              </div>
            </div>
            <ControlBar
              show={(state === 'entering' || state === 'entered')}
              className="control-bar--delayed control-bar--align-right"
            >
              { buttons }
            </ControlBar>
          </div>
        )}
      </Transition>
    );
  }
}

export { Card };
export default window(Card);
