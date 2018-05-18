import { actionTypes as protocolFileActionTypes } from './protocol/file';
import { actionTypes as protocolStageActionTypes } from './protocol/stages';

const initialState = {
  activeProtocol: {}, // protocolMeta
  lastSaved: 0,
  lastChanged: 0,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolFileActionTypes.OPEN_PROTOCOL: {
      return {
        ...state,
        activeProtocol: action.meta,
        lastSaved: 0,
        lastChanged: 0,
      };
    }
    case protocolFileActionTypes.SAVE_COMPLETE:
      return {
        ...state,
        lastSaved: new Date().getTime(),
      };
    case protocolStageActionTypes.CREATE_STAGE:
    case protocolStageActionTypes.UPDATE_STAGE:
      return {
        ...state,
        lastChanged: new Date().getTime(),
      };
    default:
      return state;
  }
}

const actionCreators = {
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};
