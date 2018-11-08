import React, { Component } from 'react';
import cx from 'classnames';
import { map } from 'lodash';
import DefaultControls from './Controls';
import Items from './Items';

class List extends Component {
  static defaultProps = {
    controls: DefaultControls,
    search: items => items,
    onDelete: () => {},
    onSort: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      parameters: {},
    };
  }

  handleUpdateParameters = (parameters) => {
    this.setState({ parameters });
  }

  items() {
    const { items, search } = this.props;
    const { parameters } = this.state;

    const withIndices = map(items, (item, _index) => ({ ...item, _index }));

    return search(withIndices, parameters);
  }

  render() {
    const {
      controls: Controls,
      item: Item,
      className,
      onSort,
      onDelete,
      children,
      ...rest
    } = this.props;

    return (
      <div className={cx(className)}>
        { children }
        { Controls && (
          <div className="list__controls">
            <Controls onChange={this.handleUpdateParameters} />
          </div>
        )}
        <div className="list__items">
          <Items
            {...rest}
            items={this.items()}
            onSort={onSort}
            onDelete={onDelete}
            item={Item}
          />
        </div>
      </div>
    );
  }
}

export default List;