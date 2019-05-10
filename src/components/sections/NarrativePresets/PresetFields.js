/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import NewVariableWindow from '../../NewVariableWindow';
import withPresetProps from './withPresetProps';
import withNewVariableWindowHandlers, {
  propTypes as newVariableWindowPropTypes,
} from '../../enhancers/withNewVariableWindowHandlers';
import Section from '../Section';
import Row from '../Row';

const PresetFields = ({
  entity,
  type,
  layoutVariblesForSubject,
  groupVariablesForSubject,
  edgesForSubject,
  highlightVariablesForSubject,
  handleCreateLayoutVariable,
  handleCreateGroupVariable,
  handleDeleteVariable,
  openNewVariableWindow,
  closeNewVariableWindow,
  newVariableName,
  showNewVariableWindow,
}) => (
  <Section>
    <Row>
      <h3 id={getFieldId('text')}>Preset label</h3>
      <ValidatedField
        name="label"
        component={Fields.Text}
        label=""
        placeholder="Enter a label for the preset here"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <ValidatedField
        name="layoutVariable"
        component={ArchitectFields.CreatableSelect}
        label="Layout variable"
        placeholder="&mdash; Select a layout variable &mdash;"
        validation={{ required: true }}
        options={layoutVariblesForSubject}
        onCreateOption={handleCreateLayoutVariable}
        onDeleteOption={handleDeleteVariable}
        formatCreateLabel={inputValue => (
          <span>Press enter to create a new layout variable named &quot;{inputValue}&quot;.</span>
        )}
      />
    </Row>
    <Row>
      <ValidatedField
        name="groupVariable"
        component={ArchitectFields.CreatableSelect}
        label="Group variable"
        options={groupVariablesForSubject}
        onCreateOption={name => openNewVariableWindow(name)}
        onDeleteOption={handleDeleteVariable}
        formatCreateLabel={inputValue => (
          <span>Press enter to create a new boolean variable named &quot;{inputValue}&quot;.</span>
        )}
      />
    </Row>
    <Row>
      <Field
        name="edges.display"
        component={Fields.CheckboxGroup}
        label="Display the following edges:"
        placeholder="&mdash; Toggle an edge to display &mdash;"
        options={edgesForSubject}
      />
    </Row>
    <Row>
      <Field
        name="highlight"
        component={Fields.CheckboxGroup}
        label="Highlight nodes with the following attribute:"
        placeholder="&mdash; Toggle a variable to highlight &mdash;"
        options={highlightVariablesForSubject}
      />
    </Row>

    <NewVariableWindow
      initialValues={{
        type: 'categorical',
        name: newVariableName,
      }}
      show={showNewVariableWindow}
      entity={entity}
      type={type}
      onComplete={handleCreateGroupVariable}
      onCancel={closeNewVariableWindow}
    />
  </Section>
);

PresetFields.propTypes = {
  layoutVariblesForSubject: PropTypes.array,
  groupVariablesForSubject: PropTypes.array,
  edgesForSubject: PropTypes.array,
  highlightVariablesForSubject: PropTypes.array,
  handleCreateLayoutVariable: PropTypes.func.isRequired,
  handleCreateGroupVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
  ...newVariableWindowPropTypes,
};

PresetFields.defaultProps = {
  layoutVariblesForSubject: [],
  groupVariablesForSubject: [],
  edgesForSubject: [],
  highlightVariablesForSubject: [],
};

export { PresetFields };

export default compose(
  withNewVariableWindowHandlers,
  withPresetProps,
)(PresetFields);
