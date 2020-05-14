import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import Codebook from '@components/Codebook/Codebook';
import Screen from '@components/Screen/Screen';

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
class CodebookScreen extends Component {
  handleCancel = this.props.onComplete;

  render() {
    const {
      show,
      transitionState,
      onComplete,
    } = this.props;

    const buttons = [
      <Button
        key="done"
        onClick={onComplete}
        iconPosition="right"
      >
        Continue
      </Button>,
    ];

    return (
      <Screen
        show={show}
        buttons={buttons}
        transitionState={transitionState}
        onAcknowledgeError={this.handleCancel}
      >
        <div className="editor">
          <div className="editor__window">
            <div className="editor__container">
              <div className="editor__content">
                <div className="stage-editor variable-registry">
                  <div className="stage-heading">
                    <div className="stage-heading__name">
                      Codebook
                    </div>
                  </div>
                  <div className="stage-editor-section">
                    <Codebook />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Screen>
    );
  }
}

CodebookScreen.propTypes = {
  show: PropTypes.bool,
  transitionState: PropTypes.string,
  onComplete: PropTypes.func,
};

CodebookScreen.defaultProps = {
  show: true,
  transitionState: null,
  onComplete: () => {},
};
// const mapDispatchToProps = dispatch => ({
//   deleteType: bindActionCreators(codebookActions.deleteType, dispatch),
//   openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
// });

export { CodebookScreen };

export default CodebookScreen;
