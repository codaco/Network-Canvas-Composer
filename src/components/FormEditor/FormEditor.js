import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { get, map, toPairs, fromPairs } from 'lodash';
import { ValidatedField, MultiSelect } from '../Form';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import Guidance from '../Guidance';
import Disable from '../Disable';
import NodeType from './NodeType';
import { getFieldId } from '../../utils/issues';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const allowedTypes = ['text', 'number', 'boolean', 'ordinal', 'categorical'];

const getInputsForType = (type) => {
  switch (type) {
    case 'number':
      return ['NumberInput'];
    case 'boolean':
      return ['Checkbox', 'Toggle', 'ToggleButton'];
    case 'ordinal':
      return ['RadioGroup'];
    case 'categorical':
      return ['CheckboxGroup', 'ToggleButtonGroup'];
    default:
      return ['Text'];
  }
};

const optionGetter = (variables) => {
  const allowedVariables = fromPairs(
    toPairs(variables)
      .filter(([, options]) => allowedTypes.includes(options.type)),
  );

  return (property, rowValues, allValues) => {
    const variable = get(rowValues, 'variable');
    switch (property) {
      case 'variable': {
        const used = map(allValues, 'variable');
        return map(
          allowedVariables,
          (value, id) => ({
            value: id,
            label: value.name,
            disabled: value !== variable && used.includes(value),
          }),
        );
      }
      case 'component':
        return getInputsForType(get(variables, [variable, 'type']));
      default:
        return [];
    }
  };
};

class FormEditor extends Component {
  handleAttemptTypeChange = () => {
    this.props.openDialog({
      type: 'Confirm',
      title: 'Change node type',
      message: 'First you will need to reset the rest of the form, are you sure?',
      onConfirm: () => { this.props.resetFields(); },
      confirmLabel: 'Continue',
    });
  }

  render() {
    const {
      nodeTypes,
      variables,
      toggleCodeView,
    } = this.props;

    return (
      <div>
        <h1>Edit Form</h1>
        <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

        <Guidance contentId="guidance.form.title">
          <div className="stage-editor-section">
            <h2 id={getFieldId('title')}>Title</h2>
            <ValidatedField
              name="title"
              component={ArchitectFields.SeamlessText}
              placeholder="Enter your title here"
              validation={{ required: true }}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.type">
          <div className="stage-editor-section">
            <h2 id={getFieldId('type')}>Node Type</h2>
            <Disable
              disabled={!!this.props.nodeType}
              className="stage-editor__reset"
              onClick={this.props.nodeType ? this.handleAttemptTypeChange : () => {}}
            >
              <ValidatedField
                name="type"
                component={Fields.RadioGroup}
                placeholder="Enter your title here"
                className="form-fields-node-select"
                options={nodeTypes}
                validation={{ required: true }}
                optionComponent={NodeType}
              >
                <option value="" disabled>&mdash; Select type &mdash;</option>
              </ValidatedField>
            </Disable>
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.variables">
          <div className="stage-editor-section">
            <h2>Form variables</h2>
            <MultiSelect
              name="fields"
              properties={[
                'variable',
                'component',
              ]}
              options={optionGetter(variables)}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.continue">
          <div className="stage-editor-section">
            <Field
              name="optionToAddAnother"
              component={Fields.Toggle}
              fieldLabel="Continuous entry"
              label="Enable 'Add another' option in form"
            />
          </div>
        </Guidance>
      </div>
    );
  }
}

FormEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  resetFields: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
  variables: PropTypes.object.isRequired,
  nodeTypes: PropTypes.array.isRequired,
  openDialog: PropTypes.func.isRequired,
};

FormEditor.defaultProps = {
  nodeType: null,
};

const mapDispatchToProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { FormEditor };

export default connect(null, mapDispatchToProps)(FormEditor);
