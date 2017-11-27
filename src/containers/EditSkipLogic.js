import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { has, isEqual, toPairs } from 'lodash';
import { Button } from 'network-canvas-ui';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import { Card, NetworkRule, FilterGroup } from '../containers';
import draft from '../behaviours/draft';
import { RuleDropDown } from '../components';

const defaultLogic = {
  action: 'SKIP',
  operator: '',
  value: '',
  filter: {
    join: '',
    rules: [],
  },
};

class EditSkipLogic extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    cancel: PropTypes.bool,
  };

  static defaultProps = {
    show: false,
    cancel: false,
  }

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.props.draft,
      },
    );

    this.props.onComplete();
  };

  render() {
    const {
      show,
      cancel,
      onCancel,
      hasChanges,
      updateDraft,
      draft: {
        filter,
        action,
        ...predicate
      },
    } = this.props;

    const buttons = [
      hasChanges ? <Button key="save" size="small" onClick={this.onSave}>Save</Button> : undefined,
      <Button key="cancel" size="small" onClick={onCancel}>Cancel</Button>,
    ];

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        buttons={buttons}
        show={show}
        cancel={cancel}
      >
        <div className="edit-skip-logic">
          <div className="edit-skip-logic__section">
            <div className="edit-skip-logic__action">
              <RuleDropDown
                options={toPairs({ SHOW: 'Show this stage if', SKIP: 'Skip this stage if' })}
                onChange={value => updateDraft({ action: value })}
                value={action}
              />
            </div>
          </div>
          <div className="edit-skip-logic__section">
            <div className="edit-skip-logic__rule">
              <NetworkRule
                logic={predicate}
                onChange={logic => updateDraft(logic)}
              />
            </div>
          </div>
          <div className="edit-skip-logic__section">
            <FilterGroup
              filter={filter}
              onChange={newFilter => updateDraft({ filter: newFilter })}
            />
          </div>
          <div className="edit-skip-logic__guidance">
            <div className="edit-skip-logic__bubble">
              Skip logic tells Network Canvas when to skip past a stage. Using it,
              you can create different pathways through your interview.
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

function getSkipLogic(stage) {
  if (!stage) { return null; }

  return (has(stage, 'skipLogic') ? stage.skipLogic : defaultLogic);
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props);
    const draft = getSkipLogic(stage);

    return { draft };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditSkipLogic };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  draft,
)(EditSkipLogic);
