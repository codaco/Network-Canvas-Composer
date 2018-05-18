import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, includes, keys } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle';
import DropDown from './DropDown';
import Input from './Input';
import { getVariableRegistry } from '../../selectors/protocol';

const operators = toPairs({
  EXACTLY: 'is Exactly',
  EXISTS: 'Exists',
  NOT_EXISTS: 'Not Exists',
  NOT: 'is Not',
  GREATER_THAN: 'is Greater Than',
  GREATER_THAN_OR_EQUAL: 'is Greater Than or Exactly',
  LESS_THAN: 'is Less Than',
  LESS_THAN_OR_EQUAL: 'is Less Than or Exactly',
});

class EgoRule extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    onUpdateRule: PropTypes.func,
    onDeleteRule: PropTypes.func,
    options: PropTypes.shape({
      attribute: PropTypes.string,
      operator: PropTypes.string,
      value: PropTypes.string,
    }),
    nodeAttributes: PropTypes.array,
    className: PropTypes.string,
  };

  static defaultProps = {
    options: {
      attribute: '',
      operator: '',
      value: '',
    },
    onUpdateRule: () => {},
    onDeleteRule: () => {},
    nodeAttributes: [],
    className: '',
  };

  showOperator() {
    return !!this.props.options.attribute;
  }

  showValue() {
    return !!this.props.options.operator &&
      !includes(['EXISTS', 'NOT_EXISTS'], this.props.options.operator);
  }

  render() {
    const {
      id,
      nodeAttributes,
      onUpdateRule,
      onDeleteRule,
      options: { operator, attribute, value },
      className,
    } = this.props;

    return (
      <div className={cx('rule', 'rule--ego', className)}>
        <DragHandle />
        <div className="rule__options">
          <div className="rule__option rule__option--attribute">
            <DropDown
              options={nodeAttributes}
              value={attribute}
              placeholder="{variable}"
              onChange={newValue => onUpdateRule(newValue, id, 'attribute')}
            />
          </div>
          { this.showOperator() && (
            <div className="rule__option rule__option--operator">
              <DropDown
                options={operators}
                value={operator}
                placeholder="{rule}"
                onChange={newValue => onUpdateRule(newValue, id, 'operator')}
              />
            </div>
          )}
          {this.showValue() && (
            <div className="rule__option rule__option--value">
              <Input
                value={value}
                onChange={newValue => onUpdateRule(newValue, id, 'value')}
              />
            </div>
          )}
        </div>
        <div className="rule__delete" onClick={() => onDeleteRule(id)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);

  return {
    nodeAttributes: keys(variableRegistry.node.person.variables),
  };
}

export { EgoRule };

export default compose(
  SortableElement,
  connect(mapStateToProps),
)(EgoRule);
