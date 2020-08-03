import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { actionCreators as protocolsActions, actionLocks as protocolLocks } from '@modules/protocols';
import { selectors as uiSelectors } from '@modules/ui';
import createButtonGraphic from '@app/images/home/create-button.svg';
import openButtonGraphic from '@app/images/home/open-button.svg';
import resumeBackgroundGraphic from '@app/images/home/resume-background.svg';
import GraphicButton from '@components/GraphicButton';
import Section from './Section';
import Group from './Group';
import Sprite from './Sprite';
import ProtocolCard from './ProtocolCard';

const getRecentProtocols = state =>
  get(state, 'recentProtocols', [])
    .slice(0, 1);

const LaunchPad = ({
  openProtocol,
  createAndLoadProtocol,
  resumeProtocol,
  unbundleAndLoadProtocol,
  isProtocolsBusy,
}) => {
  const handleOpenProtocol = () => openProtocol();

  const handleCreateProtocol = () => createAndLoadProtocol();

  const handleLoadProtocol = filePath =>
    unbundleAndLoadProtocol(filePath);

  const disableButtons = isProtocolsBusy;

  return (
    <Section className="launch-pad">
      { resumeProtocol &&
        <Group>
          <Sprite
            src={resumeBackgroundGraphic}
            width="calc(50% - 7rem)"
            height="90%"
            position="absolute"
            bottom={0}
            right="5.7rem"
            opacity="0.33"
            backgroundPosition="top right"
            backgroundSize="100% auto"
          />
          <div className="launch-pad__resume">
            <h2>Resume Editing</h2>
            <ProtocolCard
              description={resumeProtocol.description}
              lastModified={resumeProtocol.lastModified}
              name={resumeProtocol.name}
              onClick={() => handleLoadProtocol(resumeProtocol.filePath)}
              disabled={disableButtons}
              schemaVersion={resumeProtocol.schemaVersion}
            />
          </div>
        </Group>
      }
      <Group color="platinum">
        <h2>Create or Open</h2>
        <div className="launch-pad__actions">
          <div className="launch-pad__action">
            <GraphicButton
              graphic={createButtonGraphic}
              graphicPosition="1rem 3.15rem"
              onClick={handleCreateProtocol}
              disabled={disableButtons}
            >
              <h2>Create</h2>
              <h3>New Protocol</h3>
            </GraphicButton>
          </div>
          <div className="launch-pad__action-divider" />
          <div className="launch-pad__action">
            <GraphicButton
              graphic={openButtonGraphic}
              graphicPosition="1rem 3.15rem"
              color="slate-blue--dark"
              onClick={handleOpenProtocol}
              disabled={disableButtons}
            >
              <h2>Open</h2>
              <h3>from Computer</h3>
            </GraphicButton>
          </div>
        </div>
      </Group>
    </Section>
  );
};

LaunchPad.propTypes = {
  openProtocol: PropTypes.func.isRequired,
  createAndLoadProtocol: PropTypes.func.isRequired,
  unbundleAndLoadProtocol: PropTypes.func.isRequired,
  resumeProtocol: PropTypes.object,
  isProtocolsBusy: PropTypes.bool,
};

LaunchPad.defaultProps = {
  resumeProtocol: null,
  isProtocolsBusy: false,
};

const mapStateToProps = state => ({
  resumeProtocol: getRecentProtocols(state)[0],
  isProtocolsBusy: uiSelectors.getIsBusy(state, protocolLocks.protocols),
});

const mapDispatchToProps = {
  createAndLoadProtocol: protocolsActions.createAndLoadProtocol,
  unbundleAndLoadProtocol: protocolsActions.unbundleAndLoadProtocol,
  openProtocol: protocolsActions.openProtocol,
};

const withState = connect(mapStateToProps, mapDispatchToProps);

export { LaunchPad };

export default withState(LaunchPad);
