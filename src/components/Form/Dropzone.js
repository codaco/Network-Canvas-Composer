import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { times } from 'lodash';

const { dialog } = require('electron').remote;

const matchExtension = (path, extension) =>
  RegExp(`${extension}$`).test(path);

const acceptsPath = accepts => path =>
  accepts.some(accept => matchExtension(path, accept));

const acceptsPaths = (accepts, paths) => {
  if (!paths || paths.length === 0) { return false; }
  return paths.every(acceptsPath(accepts));
};

const getAcceptsExtensions = accepts =>
  accepts
    .filter(accept => /^\.[a-z]+$/.test(accept))
    .map(accept => accept.substr(1));

const initialState = {
  isActive: false, // is doing something
  isAcceptable: false, // can accept file
  isDisabled: false, // is disabled
  error: null,
};

const Dropzone = ({
  onDrop,
  className,
  accepts,
  disabled,
}) => {
  const [state, setState] = useState(initialState);

  const acceptsKey = accepts.toString();
  const isDisabled = disabled || state.isActive;

  const startHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) { return false; }

    setState(previousState => ({ ...previousState, isActive: true }));

    return true;
  };

  const submitPaths = (filePaths) => {
    const isAcceptable = acceptsPaths(accepts, filePaths);

    if (!isAcceptable) {
      setState(previousState => ({ ...previousState, isActive: false }));
      return;
    }

    setState(previousState => ({ ...previousState, isAcceptable: true }));

    onDrop(filePaths)
      .finally(() => {
        setState(previousState => ({ ...previousState, ...initialState }));
      });
  };

  const handleClick = useCallback((e) => {
    if (!startHandler(e)) { return; }

    const extensions = getAcceptsExtensions(accepts);

    dialog.showOpenDialog({
      filters: [
        // TODO: name!
        { name: 'Images', extensions },
      ],
    }, filePaths => submitPaths(filePaths));
  }, [acceptsKey, isDisabled, submitPaths]);

  const handleDrop = useCallback((e) => {
    if (!startHandler(e)) { return; }

    const files = e.dataTransfer.files;
    const filePaths = times(files.length, i => files.item(i).path);

    // If the user drags a file attachment from a browser, we get a url instead of a file
    if (!files || filePaths.length < 1) {
      const urlName = e.dataTransfer.getData && e.dataTransfer.getData('URL');

      if (urlName) {
        const errorMessage = 'Dragging files from this source is not currently supported. Please download the file to your computer and try again.';
        setState(previousState => ({ ...previousState, isActive: false, error: errorMessage }));
        return;
      }
    }

    submitPaths(filePaths);
  }, [acceptsKey, isDisabled, submitPaths]);

  const handleDragEnter = useCallback(() => {
    if (isDisabled) { return; }
    setState(previousState => ({ ...previousState, isHover: true }));
  }, [isDisabled]);

  const handleDragExit = useCallback(() => {
    setState(previousState => ({ ...previousState, isHover: false }));
  });

  const dropzoneClasses = cx(
    className,
    {
      [`${className}--active`]: true, //state.isActive,
      [`${className}--hover`]: state.isHover,
      [`${className}--disabled`]: isDisabled,
      [`${className}--error`]: state.error,
    },
  );

  return (
    <div
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragExit={handleDragExit}
    >
      <div className={dropzoneClasses}>
        <div className={`${className}__container`} />
        <div className={`${className}__label`}>
          Drop a file here or&nbsp;
          <div className={`${className}__link`} onClick={handleClick}>click to browse</div>
        </div>

      </div>
    </div>
  );
};

Dropzone.defaultProps = {
  className: 'form-dropzone',
};

export { Dropzone };

export default Dropzone;
