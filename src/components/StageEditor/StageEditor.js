import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { compose, defaultProps } from 'recompose';
import Editor from '@components/Editor';
import Layout from '@components/EditorLayout';
import FormCodeView from '@components/CodeView/FormCodeView';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import StageHeading from './StageHeading';
import SkipLogic from './SkipLogic';

const formName = 'edit-stage';

const StageEditor = ({
  id,
  previewStage,
  interfaceType,
  stagePath,
  hasSkipLogic,
  ...props
}) => {
  const [showCodeView, setShowCodeView] = useState(false);
  const toggleShowCodeView = () => setShowCodeView(show => !show);

  useEffect(() => {
    ipcRenderer.on('REFRESH_PREVIEW', previewStage);

    return () =>
      ipcRenderer.removeListener('REFRESH_PREVIEW', previewStage);
  }, []);

  const sections = useMemo(
    () => getInterface(interfaceType).sections,
    [interfaceType],
  );

  const renderSections = ({ submitFailed, windowRoot }) =>
    sections.map((SectionComponent, index) => (
      <SectionComponent
        key={index}
        form={formName}
        stagePath={stagePath}
        hasSubmitFailed={submitFailed}
        // `windowRoot` will ensure connect() components re-render
        // when the window root changes
        windowRoot={windowRoot}
        interfaceType={interfaceType}
      />
    ));

  return (
    <Editor
      formName={formName}
      {...props}
    >
      {
        ({ submitFailed, windowRoot }) => (
          <Layout>
            <FormCodeView
              form={formName}
              show={showCodeView}
              toggleCodeView={toggleShowCodeView}
            />
            <StageHeading id={id} toggleCodeView={toggleShowCodeView} />
            <div className="stage-editor-section stage-editor-section--no-border">
              <SkipLogic />
            </div>
            {renderSections({ submitFailed, windowRoot })}
          </Layout>
        )
      }
    </Editor>
  );
};

StageEditor.propTypes = {
  interfaceType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  previewStage: PropTypes.func.isRequired,
  stagePath: PropTypes.any.isRequired,
  hasSkipLogic: PropTypes.bool,
};

StageEditor.defaultProps = {
  hasSkipLogic: false,
};

export {
  formName,
  StageEditor,
};

export default compose(
  defaultProps({
    form: formName,
  }),
  withStageEditorMeta,
  withStageEditorHandlers,
)(StageEditor);
