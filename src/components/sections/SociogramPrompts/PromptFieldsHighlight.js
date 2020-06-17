import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import ValidatedField from '@components/Form/ValidatedField';
import withCreateVariableHandlers from '@components/enhancers/withCreateVariableHandler';
import Tip from '@components/Tip';
import withHighlightOptions from './withHighlightOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';

const HighlightFields = ({
  allowHighlighting,
  canCreateEdge,
  entity,
  handleCreateVariable,
  handleDeleteVariable,
  handleEdgeHighlightChange,
  highlightVariablesForSubject,
  normalizeKeyDown,
  setCanCreateEdge,
  type,
}) => {
  const handleChangeAllowHighlighting = (value) => {
    handleEdgeHighlightChange();
    setCanCreateEdge(!value && canCreateEdge);
  };

  return (
    <Section contentId="guidance.editor.sociogram_prompt.attributes" group>
      <h3>Variable Toggling</h3>
      <p>
        The sociogram can be configured to allow the participant to toggle
        a node variable to true or false by tapping it.
      </p>
      <Tip>
        <p>
          You cannot use this setting at the same time
          as the &quot;Create edges&quot; option above. Enabling this setting will
          disable that option.
        </p>
      </Tip>
      <Field
        component={Fields.Toggle}
        name="highlight.allowHighlighting"
        onChange={handleChangeAllowHighlighting}
        label="Enable variable toggling by tapping a node"
        disabled={canCreateEdge}
        title={canCreateEdge && 'Create edge must be disabled to allow highlighting'}
      />
      <Row disabled={!allowHighlighting}>
        { allowHighlighting &&
          <ValidatedField
            name="highlight.variable"
            component={VariableSelect}
            entity={entity}
            type={type}
            label="Which boolean variable should be toggled?"
            onCreateOption={value => handleCreateVariable(value, 'boolean')}
            onDeleteOption={value => handleDeleteVariable(value)}
            onKeyDown={normalizeKeyDown}
            validation={{ required: true }}
            placeholder="&mdash; Select a variable to toggle, or type a name to create a new one &mdash;"
            options={highlightVariablesForSubject}
            formatCreateLabel={inputValue => (
              <span>
                Click here to create a new boolean variable named &quot;{inputValue}&quot;.
              </span>
            )}
          />
        }
      </Row>
    </Section>
  );
};

HighlightFields.propTypes = {
  allowHighlighting: PropTypes.bool,
  canCreateEdge: PropTypes.bool.isRequired,
  entity: PropTypes.string.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  highlightVariablesForSubject: PropTypes.array.isRequired,
  normalizeKeyDown: PropTypes.func.isRequired,
  setCanCreateEdge: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

HighlightFields.defaultProps = {
  allowHighlighting: false,
};

export { HighlightFields };

export default compose(
  withHighlightOptions,
  withEdgeHighlightChangeHandler,
  withCreateVariableHandlers,
)(HighlightFields);
