import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form as ReduxForm, formValueSelector, formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { Guided } from '../Guided';
import flatten from '../../utils/flatten';
import { getInterface } from './Interfaces';
import FormCodeView from '../FormCodeView';

const formName = 'edit-stage';
const getFormValues = formValueSelector(formName);
const form = { name: formName, getValues: getFormValues };

class StageEditor extends Component {
  get sections() {
    return getInterface(this.props.stage.type).sections;
  }

  renderSections() {
    return this.sections.map((SectionComponent, index) =>
      <SectionComponent key={index} form={form} />,
    );
  }

  render() {
    const {
      stage,
      handleSubmit,
      toggleCodeView,
      codeView,
      dirty,
      invalid,
    } = this.props;

    return (
      <ReduxForm onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
        <FormCodeView toggleCodeView={toggleCodeView} form={form.name} />
        <Guided
          className="stage-editor__sections"
          defaultGuidance={`guidance.interface.${stage.type}`}
          form={form}
        >
          <h1>Edit {stage.type} Screen</h1>
          { dirty && invalid && (
            <p style={{ color: 'var(--error)' }}>
              There are some errors that need to be fixed before this can be saved!
            </p>
          ) }
          <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

          {this.renderSections()}
        </Guided>
      </ReduxForm>
    );
  }
}

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const mapStateToProps = (state, props) => ({
  initialValues: props.stage,
});

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
    onSubmitFail: (errors) => {
      // eslint-disable-next-line no-console
      console.error('FORM ERRORS', flatten(errors));
    },
  }),
)(StageEditor);
