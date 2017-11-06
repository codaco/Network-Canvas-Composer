import { connect } from 'react-redux';
import { keys } from 'lodash';
import { getVariableRegistry } from '../selectors/protocol';
import { EdgeSelector } from '../components';

function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);

  return {
    edgeTypes: keys(variableRegistry.edge),
  };
}

export default connect(mapStateToProps)(EdgeSelector);
