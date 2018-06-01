import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, has, difference } from 'lodash';
import cx from 'classnames';
import propTypes from './propTypes';
import { Section, Editor, Guidance } from '../../Guided';
import Contexts from '../../../components/Form/Fields/Contexts';

class NodeType extends Component {
  resetStage() {
    const { stage, resetField } = this.props;
    // eslint-disable-next-line
    if (confirm('First you will need to reset the rest of the stage, are you sure?')) {
      const fieldsToReset = difference(keys(stage), ['id', 'type', 'label']);

      fieldsToReset.forEach(resetField);
    }
  }

  render() {
    const {
      nodeTypes,
      disabled,
      stage,
      form,
      resetField,
      ...rest
    } = this.props;

    const nodeTypeClasses = cx('stage-editor-section-node-type', { 'stage-editor-section-node-type--disabled': disabled });

    return (
      <Section className="stage-editor-section" {...rest}>
        <Editor className="stage-editor-section__edit">
          <div className={nodeTypeClasses}>
            <h2>Node Type</h2>
            <p>Which type of node does this name generator create?</p>
            <div
              className="stage-editor-section-node-type__edit"
              onClick={disabled ? () => this.resetStage() : () => {}}
            >
              <div className="stage-editor-section-node-type__edit-capture">
                <Field
                  name="subject"
                  parse={value => ({ type: value, entity: 'node' })}
                  format={value => get(value, 'type')}
                  options={nodeTypes}
                  component={Contexts}
                />
              </div>
            </div>
          </div>
        </Editor>
        <Guidance className="stage-editor-section__guidance">
          <p>
            {'Here, you can determine the type of node that this name generator will work with. Either choose from your existing node types, or create a new one.'}
          </p>
          <p>
            {'Think of the node\'s "type" as its most fundamental attribute. To ascertain what it may be, ask yourself what the node represents. For example, is it a person? A place?'}
          </p>
          <p>
            {'Node types are fundamental to the way that Network Canvas works. A node\'s type determines its visual properties, as well as the variables available to assign on other interfaces.'}
          </p>
        </Guidance>
      </Section>
    );
  }
}

NodeType.propTypes = {
  nodeTypes: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  stage: PropTypes.object.isRequired,
  resetField: PropTypes.func.isRequired,
  ...propTypes,
};

NodeType.defaultProps = {
  nodeTypes: [],
  disabled: false,
};

const mapStateToProps = (state, { form }) => {
  const stage = getFormValues(form.name)(state);

  return {
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    disabled: has(stage, 'subject.type'),
    stage,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  resetField: field => dispatch(changeField(form.name, field, null)),
});

export { NodeType };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeType);
