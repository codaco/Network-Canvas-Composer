import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

export const form = 'create-new-variable';

const mapStateToProps = (state) => {
  const variableType = formValueSelector(form)(state, 'type');

  return {
    variableType,
  };
};

const withCreateNewVariableState = connect(mapStateToProps);

export default withCreateNewVariableState;
