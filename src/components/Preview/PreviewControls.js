import React from 'react';
import { remote } from 'electron';
import { Button } from '../../ui/components';

const handleClose = () => {
  remote.getGlobal('previewWindow').hide();
};

const handleRefresh = () => {
  remote.getGlobal('appWindow').webContents.send('REFRESH_PREVIEW');
};

const PreviewControls = () => (
  <div className="preview-controls">
    <Button onClick={handleRefresh}>Refresh</Button>
    <Button onClick={handleClose}>Close</Button>
  </div>
);

export default PreviewControls;