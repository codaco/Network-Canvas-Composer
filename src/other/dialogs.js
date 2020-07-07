import { remote } from 'electron';

const defaultOpenDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

const defaultSaveDialogOptions = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save:',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['saveFile'],
};

const defaultSaveCopyDialogOptions = {
  buttonLabel: 'Save Copy',
  nameFieldLabel: 'Save:',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['saveFile'],
};


/**
 * Shows a open dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 */
const openDialog = (openDialogOptions = {}) => {
  const options = {
    ...defaultOpenDialogOptions,
    ...openDialogOptions,
  };

  return remote.dialog.showOpenDialog(
    remote.getCurrentWindow(),
    options,
  );
};

/**
 * Shows a save dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 */
const saveDialog = (saveDialogOptions = {}) => {
  const options = {
    ...defaultSaveDialogOptions,
    ...saveDialogOptions,
  };

  // (filePath) => {
  //   const cancelled = filePath === undefined;
  //   resolve({ cancelled, filePath });
  // },

  return remote.dialog.showSaveDialog(
    remote.getCurrentWindow(),
    options,
  );
};

const saveCopyDialog = (saveCopyOptions = {}) => {
  const options = { ...defaultSaveCopyDialogOptions, ...saveCopyOptions };
  return saveDialog(options);
};

export {
  saveDialog,
  saveCopyDialog,
  openDialog,
};

