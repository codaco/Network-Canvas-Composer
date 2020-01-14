import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import window from '@codaco/ui/lib/components/window';
import Button from '@codaco/ui/lib/components/Button';
import SimpleDialog from '@codaco/ui/lib/components/Dialog/Simple';
import Stackable from '../../components/Stackable';
import AssetBrowser from './AssetBrowser';

const AssetBrowserWindow = ({
  show,
  type,
  selected,
  onCancel,
  onSelect,
}) => {
  const cancelButton = [(
    <Button
      color="white"
      onClick={onCancel}
      key="cancel"
    >
      Cancel
    </Button>
  )];

  return (
    <Stackable stackKey={show}>
      {({ stackIndex }) => (
        <SimpleDialog
          show={show}
          onBlur={onCancel}
          title="Asset Browser"
          options={cancelButton}
          style={{
            zIndex: stackIndex + 10000,
          }}
          className="asset-browser__window"
        >
          <AssetBrowser
            type={type}
            onSelect={onSelect}
            selected={selected}
          />
        </SimpleDialog>
      )}
    </Stackable>
  );
};

AssetBrowserWindow.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetBrowserWindow.defaultProps = {
  show: true,
  type: null,
  selected: null,
  onSelect: () => {},
  onCancel: () => {},
  stackIndex: null,
};

export default compose(
  window,
)(AssetBrowserWindow);
