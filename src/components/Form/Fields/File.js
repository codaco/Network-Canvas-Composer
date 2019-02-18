import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import uuid from 'uuid';
import cx from 'classnames';
import AssetBrowser from '../../AssetBrowser';
import Button from '../../../ui/components/Button';
import Icon from '../../../ui/components/Icon';

const withShowBrowser = withState(
  'showBrowser',
  'setShowBrowser',
  ({ showBrowser }) => !!showBrowser,
);

class FileInput extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    onChange: PropTypes.func,
    onCloseBrowser: PropTypes.func,
    showBrowser: PropTypes.bool.isRequired,
    setShowBrowser: PropTypes.func.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    value: '',
    label: '',
    className: '',
    onChange: () => {},
    onCloseBrowser: () => {},
    type: null,
    children: value => value,
  };

  componentWillMount() {
    this.id = uuid();
  }

  closeBrowser() {
    this.props.setShowBrowser(false);
    this.props.onCloseBrowser();
  }

  openBrowser() {
    this.props.setShowBrowser(true);
  }

  handleBrowseLibrary = (e) => {
    e.stopPropagation();
    this.openBrowser();
  }

  handleBlurBrowser = () => {
    this.closeBrowser();
  }

  handleSelectAsset = (assetId) => {
    this.closeBrowser();
    this.props.input.onChange(assetId);
  }

  render() {
    const {
      input: { value },
      meta: { error, invalid, touched },
      showBrowser,
      label,
      type,
      className,
    } = this.props;

    const fieldClasses = cx(
      'form-fields-file',
      className,
      'form-field-container',
      {
        'form-fields-file--replace': !!value,
        'form-fields-file--has-error': error,
      },
    );

    return (
      <div className={fieldClasses}>
        { label &&
          <h4 className="form-fields-file__label">{label}</h4>
        }
        {invalid && touched && <div className="form-fields-file__error"><Icon name="warning" />{error}</div>}
        <div className="form-fields-file__preview">
          {this.props.children(value)}
        </div>
        <div className="form-fields-file__browse">
          <Button
            onClick={this.handleBrowseLibrary}
            color="paradise-pink"
          >
            { !value ? 'Select asset' : 'Update asset' }
          </Button>
        </div>
        <AssetBrowser
          show={showBrowser}
          type={type}
          onSelect={this.handleSelectAsset}
          onCancel={this.handleBlurBrowser}
        />
      </div>
    );
  }
}

export { FileInput };

export default withShowBrowser(FileInput);
