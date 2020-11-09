import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import { getValidator } from '@app/utils/validations';
import { Text } from '@codaco/ui/lib/components/Fields';
import { Button } from '@codaco/ui';
import { sortBy } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';

const NativeSelect = ({
  label,
  options,
  placeholder,
  className,
  // To create a new option, one or the other of the following:
  onCreateOption, // Creating options inline, recieves value for option
  onCreateNew, // Call a function immediately (typically opening a window with a form)
  createLabelText,
  createInputLabel,
  createInputPlaceholder,
  allowPlaceholderSelect,
  reserved,
  validation,
  disabled,
  input: { onBlur, ...input },
  meta: { invalid, error, touched },
  ...rest
}) => {
  const [showCreateOptionForm, setShowCreateOptionForm] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState(null);
  const [newOptionError, setNewOptionError] = useState(false);

  const handleChange = (option) => {
    if (option.target.value === '_create') {
      input.onChange(null);
      if (onCreateNew) {
        onCreateNew();
        return;
      }

      setShowCreateOptionForm(true);
      return;
    }

    if (option.target.value === '_placeholder') {
      input.onChange(null);
      return;
    }

    input.onChange(option.target.value);
  };

  const handleCreateOption = () => {
    onCreateOption(newOptionValue);
    setShowCreateOptionForm(false);
  };

  const isValidCreateOption = () => {
    const validationErrors = getValidator(validation)(newOptionValue);

    if (validationErrors) {
      setNewOptionError(validationErrors);
      return false;
    }

    // True if option matches the label prop of the supplied object
    const matchLabel = ({ label: variableLabel }) =>
      variableLabel && newOptionValue &&
      variableLabel.toLowerCase() === newOptionValue.toLowerCase();
    const alreadyExists = options.some(matchLabel);
    const isReserved = reserved.some(matchLabel);

    if (alreadyExists || isReserved) {
      setNewOptionError(`Variable name "${newOptionValue}" is already defined on entity type ${rest.entity}`);
      return false;
    }

    setNewOptionError(false);
    return true;
  };

  const calculateMeta = useMemo(() => ({
    touched: newOptionValue !== null,
    invalid: !isValidCreateOption(newOptionValue),
    error: newOptionError,
  }), [newOptionValue, newOptionError]);

  const sortedOptions = useMemo(() => sortBy(options, 'label'), [options]);

  const variants = {
    show: { opacity: 1 },
    hide: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  const componentClasses = cx(
    className,
    'form-fields-select-native',
    {
      'form-fields-select-native--has-error': invalid && touched && error,
      'form-fields-select-native--disabled': disabled,
    },
  );

  return (
    <motion.div className="form-fields-select-native__wrapper">
      <AnimatePresence initial={false} exitBeforeEnter>
        { showCreateOptionForm ? (
          <motion.div className="form-fields-select-native__new-section" key="new-section" variants={variants} initial="hide" exit="hide" animate="show">
            <Text
              label={createInputLabel}
              autoFocus
              input={{ onChange: event => setNewOptionValue(event.target.value) }}
              placeholder={createInputPlaceholder}
              meta={calculateMeta}
            />
            <div className="button-footer">
              <Button color="platinum" onClick={() => setShowCreateOptionForm(false)}>Cancel</Button>
              <Button onClick={handleCreateOption} disabled={calculateMeta.invalid}>Create</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="select-section" className={componentClasses} initial="hide" variants={variants} exit="hide" animate="show">
            { label &&
              <h4>{label}</h4>
            }
            <select
              className="form-fields-select-native__component"
              {...input}
              value={input.value || '_placeholder'}
              onChange={handleChange}
              validation={validation}
              disabled={!!disabled}
              {...rest}
            >
              <option disabled={!allowPlaceholderSelect} value="_placeholder">-- {placeholder} --</option>
              { (onCreateOption || onCreateNew) && <option value="_create">{createLabelText}</option>}
              { sortedOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  disabled={!!option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {invalid && touched && <div className="form-fields-select-native__error"><Icon name="warning" />{error}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

NativeSelect.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  createLabelText: PropTypes.string,
  createInputLabel: PropTypes.string,
  createInputPlaceholder: PropTypes.string,
  allowPlaceholderSelect: PropTypes.bool,
  options: PropTypes.array,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  disabled: PropTypes.bool,
  onCreateOption: PropTypes.func,
  onCreateNew: PropTypes.func,
  reserved: PropTypes.array,
  validation: PropTypes.any,
};

NativeSelect.defaultProps = {
  className: '',
  placeholder: 'Select an option',
  createLabelText: '✨ Create new ✨',
  createInputLabel: 'New variable name',
  createInputPlaceholder: 'Enter a variable name...',
  allowPlaceholderSelect: false,
  options: [],
  input: { value: '' },
  label: null,
  disabled: false,
  meta: { invalid: false, error: null, touched: false },
  onCreateOption: null,
  onCreateNew: null,
  reserved: [],
  validation: null,
};

export default NativeSelect;