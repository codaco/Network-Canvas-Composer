import { connect } from 'react-redux';
import {
  reduxForm,
  formValueSelector,
  isDirty,
  isValid,
} from 'redux-form';
import { compose, withState, withHandlers } from 'recompose';
import { keys } from 'lodash';
import { getVariablesForNodeType, getNodeTypes } from '../../selectors/variableRegistry';
import TypeEditor from './TypeEditor';

const formName = 'VARIABLE_REGISTRY';

const getFormValue = formValueSelector(formName);
const getIsDirty = isDirty(formName);
const getIsValid = isValid(formName);

const mapStateToProps = (state) => {
  const formNodeType = getFormValue(state, 'type') || null;

  return {
    nodeType: formNodeType,
    nodeTypes: keys(getNodeTypes(state)),
    variables: getVariablesForNodeType(state, formNodeType),
    dirty: getIsDirty(state),
    valid: getIsValid(state),
  };
};

export { formName };
export { parse, format } from './convert';

export default compose(
  connect(mapStateToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(TypeEditor);
