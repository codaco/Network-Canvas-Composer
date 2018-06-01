import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { toPairs, get, omit, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { FormSection, change } from 'redux-form';
import cx from 'classnames';
import { Button } from '../../../../ui/components';
import Modal from '../../../Modal';
import ValidatedField from '../../ValidatedField';
import RoundButton from '../../RoundButton';
import Select from '../Select';
import Tag from './Tag';
import VariableField from './VariableField';

class VariableChooser extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    values: PropTypes.object,
    variableRegistry: PropTypes.object,
    deleteVariable: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    values: {},
    variableRegistry: {},
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      isEditing: false,
    };
  }

  onSelectVariable = ({ target: { value } }) => {
    this.editVariable(value);
  };

  editVariable = (variable) => {
    if (isEmpty(variable)) { return; }
    this.setState({ isEditing: true, editing: variable });
  };

  openEditVariable = () => {
    this.setState({ isEditing: true, editing: null });
  };

  closeEditVariable = () => {
    this.setState({ isEditing: false, editing: null });
  };

  render() {
    const { name, values, variableRegistry, className, deleteVariable } = this.props;
    const variableChooserClasses = cx('form-fields-variable-chooser', className);

    return (
      <div className={variableChooserClasses}>
        <FormSection name={name}>
          <div className="form-fields-variable-chooser__variables">
            {
              toPairs(values)
                .map(([variableName]) => (
                  <ValidatedField
                    key={variableName}
                    name={variableName}
                    component={Tag}
                    editVariable={this.editVariable}
                    deleteVariable={deleteVariable}
                    validation={get(variableRegistry, [variableName, 'validation'], {})}
                  />
                ))
            }
            <RoundButton
              className="form-fields-variable-chooser__add"
              type="button"
              onClick={this.openEditVariable}
            />
          </div>
          <Modal show={!!this.state.isEditing}>
            <div className="form-fields-variable-chooser__modal">
              <h2 className="form-fields-variable-chooser__modal-title">
                Edit variable
              </h2>
              <div className="form-fields-variable-chooser__modal-controls">
                <p>Please select a variable to add/edit</p>
                <Select
                  className="form-fields-variable-chooser__modal-value"
                  input={{
                    onChange: this.onSelectVariable,
                    value: this.state.editing || '',
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Variable name...</option>
                  {
                    toPairs(variableRegistry)
                      .map(([variableName]) => (
                        <option key={variableName} value={variableName}>{variableName}</option>
                      ))
                  }
                </Select>
              </div>

              { this.state.editing &&
                <div className="form-fields-variable-chooser__modal-setting">
                  <h3>{ this.state.editing }</h3>
                  <VariableField
                    variable={get(variableRegistry, this.state.editing, null)}
                    name={`${this.state.editing}`}
                  />
                </div>
              }
              <div className="form-fields-variable-chooser__modal-controls">
                <Button
                  onClick={this.closeEditVariable}
                  type="button"
                  size="small"
                >
                  {
                    this.state.editing ?
                      'Done' :
                      'Cancel'
                  }
                </Button>
              </div>
            </div>
          </Modal>
        </FormSection>
      </div>
    );
  }
}

const mapStateToProps = (state, { name, form }) => ({
  values: form.getValues(state, name),
});

const mapDispatchToProps = (dispatch, { name, form }) => ({
  change: bindActionCreators(
    value => change(form.name, name, value),
    dispatch,
  ),
});

export { VariableChooser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    deleteVariable: props => variable =>
      props.change(omit(props.values, variable)),
  }),
)(VariableChooser);
