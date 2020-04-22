import { getProtocolMeta } from '@selectors/protocols';
import { loadProtocolConfiguration } from '@app/other/protocols';
import history from '@app/history';
import { actionCreators as protocolActions } from '@modules/protocol/index';

const LOAD_PROTOCOL = 'PROTOCOLS/LOAD';
const LOAD_PROTOCOL_SUCCESS = 'PROTOCOLS/LOAD_SUCCESS';
const LOAD_PROTOCOL_ERROR = 'PROTOCOLS/LOAD_ERROR';

const loadProtocol = id => ({
  type: LOAD_PROTOCOL,
  id,
});

const loadProtocolSuccess = (meta, protocol) => ({
  type: LOAD_PROTOCOL_SUCCESS,
  meta,
  protocol,
  ipc: true,
});

const loadProtocolSuccessThunk = (meta, protocol) =>
  (dispatch) => {
    dispatch(loadProtocolSuccess(meta, protocol));
    dispatch(protocolActions.setProtocol(meta, protocol));
  };

const loadProtocolError = error =>
  (dispatch) => {
    dispatch({
      type: LOAD_PROTOCOL_ERROR,
      error,
    });

    history.push('/');
  };

const loadProtocolThunk = id =>
  (dispatch, getState) => {
    dispatch(loadProtocol(id));

    const state = getState();
    const meta = getProtocolMeta(state, id);

    if (!meta) {
      dispatch(loadProtocolError(`Protocol "${id}" not found in 'protocols'`));
      return Promise.resolve(); // Always return a promise
    }

    return loadProtocolConfiguration(meta.workingPath)
      .then(protocolData => dispatch(loadProtocolSuccessThunk(meta, protocolData)))
      .catch(error => dispatch(loadProtocolError(error)));
  };

const actionCreators = {
  loadProtocol: loadProtocolThunk,
  loadProtocolSuccess: loadProtocolSuccessThunk,
};

const actionTypes = {
  LOAD_PROTOCOL,
  LOAD_PROTOCOL_SUCCESS,
  LOAD_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};
