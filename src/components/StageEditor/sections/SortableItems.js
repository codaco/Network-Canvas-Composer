import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps } from 'recompose';
import { TransitionGroup } from 'react-transition-group';
import { SortableContainer } from 'react-sortable-hoc';
import { getCSSVariableAsNumber } from '../../../utils/CSSVariables';
import WipeTransition from '../../Transitions/Wipe';
import SortableItem from './SortableItem';

const SortableItems = ({ fields, itemComponent: ItemComponent, getId, ...rest }) => (
  <TransitionGroup className="sortable-items">
    { fields.map((fieldId, index) => (
      <WipeTransition key={getId(fieldId)}>
        <SortableItem remove={() => fields.remove(index)} index={index}>
          {fieldId}
          <ItemComponent fieldId={fieldId} index={index} fields={fields} {...rest} />
        </SortableItem>
      </WipeTransition>
    )) }
  </TransitionGroup>
);

SortableItems.propTypes = {
  fields: PropTypes.object.isRequired,
  itemComponent: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

SortableItems.defaultProps = {
  getId: fieldId => fieldId,
};

export { SortableItems };

export default compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
    transitionDuration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
  }),
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(SortableItems);
