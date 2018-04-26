/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import cx from 'classnames';
import { compose, mapProps } from 'recompose';
import { Button, Icon } from 'network-canvas-ui';
import Tweened from '../behaviours/Tweened';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';
import { ProtocolCard } from '../components/Start';
import networkCanvasBrand from '../images/network-canvas-brand.svg';

const transitionStyles = (componentName) =>
  mapProps(props =>
    ({
      className: cx(
        componentName,
        `${componentName}--${props.transitionState}`,
        props.className,
      ),
    })
  );

const TweenedProtocolCard = Tweened(ProtocolCard);

class Start extends PureComponent {
  static propTypes = {
    protocols: PropTypes.array.isRequired,
    createProtocol: PropTypes.func.isRequired,
    locateAndLoadProtocol: PropTypes.func.isRequired,
  };

  static defaultProps = {
    protocols: [],
  };

  componentDidMount() {
    this.props.clearDeadLinks();
  }

  openProtocol = (path) => {
    this.props.history.push(`/edit/${encodeURIComponent(path)}`);
  }

  render() {
    return (
      <div className="start">
        <div className="start__split">
          <div className="start__hero">
            <div className="start__welcome">
              <h1 className="start__welcome-title">Architect</h1>
              <p className="start__welcome-lead">A tool for creating Network Canvas interviews</p>
            </div>

            <div className="start__call-to-action">
              <Button
                type="button"
                color="white"
                size="small"
                icon={<Icon name="arrow-right" />}
                onClick={ () => this.props.createProtocol(this.openProtocol) }
              >Create new</Button>
              <Button
                type="button"
                color="platinum"
                size="small"
                icon={<Icon name="arrow-right" />}
                onClick={ () => this.props.chooseProtocol(this.openProtocol) }
              >Open existing</Button>
            </div>
          </div>
        </div>

        <div className="start__split">
          <div className="start__protocols">
            { this.props.protocols.map((protocol, index) => (
              <div
                className="start__protocols-protocol"
                key={index}
              >
                <TweenedProtocolCard
                  path={protocol.path}
                  tweenName="foo"
                  tweenElement="protocol-stack"
                />
              </div>
            )) }
          </div>
        </div>

        <div className="start__background" />
        <img className="start__brand" src={networkCanvasBrand} alt="" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocols: get(state, 'protocols', []).slice(-3),
});

const mapDispatchToProps = dispatch => ({
  createProtocol: bindActionCreators(protocolsActions.createProtocol, dispatch),
  loadProtocol: bindActionCreators(protocolsActions.loadProtocol, dispatch),
  chooseProtocol: bindActionCreators(protocolsActions.chooseProtocol, dispatch),
  clearDeadLinks: bindActionCreators(protocolsActions.clearDeadLinks, dispatch),
});

export { Start };

export default compose(
  // transitionStyles('start'),
  connect(mapStateToProps, mapDispatchToProps),
)(Start);
