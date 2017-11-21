import { remote } from 'electron';
import fs from 'fs';
import Zip from 'jszip';
import { has } from 'lodash';

const options = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save as:',
};

const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(options, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

const writeFile = (filename, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filename, content, (err) => {
      if (err) { reject(err); }
      resolve();
    });
  });

const getAssetData = asset =>
  new Promise((reject, resolve) => {
    if (has(asset, 'data')) { resolve(asset); }
    if (has(asset, 'filename')) {
      // TODO: load file data here
      const fileData = '';

      resolve({ ...asset, data: fileData });
    }

    reject();
  });

const createPackage = (protocol) => {
  const zip = new Zip();
  zip.file('protocol.json', JSON.stringify(protocol));

  return Promise.all(
    protocol.assetRegistry.map(
      asset => getAssetData(asset),
    ),
  ).then((assets) => {
    const assetsDir = zip.folder('assets');
    assets.forEach((asset) => {
      assetsDir.file(asset.name, asset.data, { base64: true });
    });
  }).then(() => zip.generateAsync({ type: 'blob' }));
};

// Expects data blog e.g.
// const zip = new Zip();
// zip.file('Hello.txt', 'Hello World\n');
// zip.generateAsync({ type: 'blob' }),
const saveToDisk = content =>
  saveDialog().then(
    filename => writeFile(filename, content),
  );

const exporter = (state) => {
  createPackage(state).then(saveToDisk);
};

export {
  createPackage,
  saveToDisk,
};

export default exporter;
