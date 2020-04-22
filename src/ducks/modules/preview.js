import { getFormValues } from 'redux-form';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getProtocol } from '@selectors/protocol';
import previewDriver from '@app/utils/previewDriver';

const getStageIndex = (protocol, stageMeta) => {
  switch (true) {
    case !!stageMeta.id:
      return protocol.stages.findIndex(({ id }) => id === stageMeta.id);
    case !!stageMeta.insertAtIndex:
      return stageMeta.insertAtIndex;
    default:
      return protocol.stages.length;
  }
};

const getDraftStages = (protocol, stageMeta, draftStage) => {
  const stages = protocol.stages;

  if (stageMeta.id) {
    return stages.map((stage) => {
      if (stage.id === draftStage.id) { return draftStage; }

      return stage;
    });
  }

  const stageIndex = getStageIndex(protocol, stageMeta);

  return [
    ...protocol.stages.slice(0, stageIndex),
    draftStage,
    ...protocol.stages.slice(stageIndex),
  ];
};

const SET_ZOOM = 'PREVIEW/ZOOM';
const REFRESH_PREVIEW = 'PREVIEW/REFRESH_PREVIEW';
const PREVIEW_DRAFT = 'PREVIEW/PREVIEW_DRAFT';
const CLOSE_PREVIEW = 'PREVIEW/CLOSE_PREVIEW';

const zoom = zoomFactor => ({
  type: SET_ZOOM,
  zoom: zoomFactor,
});

const refresh = () => ({
  type: REFRESH_PREVIEW,
});

const closePreview = () =>
  (dispatch) => {
    dispatch({
      type: CLOSE_PREVIEW,
    });

    previewDriver.close();
  };

const previewDraft = (draft, stageIndex) =>
  (dispatch, getState) => {
    const state = getState();

    const activeProtocolMeta = getActiveProtocolMeta(state);
    const workingPath = activeProtocolMeta && activeProtocolMeta.workingPath;

    const draftProtocol = {
      ...draft,
      /**
       * This allows assets to work correctly in the Network Canvas preview.
       *
       * Network canvas uses relative paths for the assets:// protocol, whereas
       * Architect uses full paths. Since Network Canvas prepares urls as:
       * `assets://${protocolUID}/assets/${asset}` this allows us to load files
       * from the correct location.
       */
      uid: workingPath,
    };

    dispatch({
      type: PREVIEW_DRAFT,
      draft: draftProtocol,
      stageIndex,
    });

    previewDriver.preview(draftProtocol, stageIndex);
  };

const previewStageFromForm = (stageMeta, formName) =>
  (dispatch, getState) => {
    const state = getState();
    const protocol = getProtocol(state);

    const draftStage = getFormValues(formName)(state);
    const stageIndex = getStageIndex(protocol, stageMeta);
    const draftStages = getDraftStages(protocol, stageMeta, draftStage);
    const draftProtocol = { ...protocol, stages: draftStages };

    dispatch(previewDraft(draftProtocol, stageIndex));
  };

const actionTypes = {
  PREVIEW_DRAFT,
  SET_ZOOM,
  REFRESH_PREVIEW,
};

const actionCreators = {
  closePreview,
  previewDraft,
  previewStageFromForm,
  zoom,
  refresh,
};

export {
  actionTypes,
  actionCreators,
};
