import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '../../../ui/components/Fields';
import DataSource from '../../Form/Fields/DataSource';
import { Filter, withFieldConnector, withStoreConnector } from '../../Query';
import ValidatedField from '../../Form/ValidatedField';
import { Item, Row } from '../../OrderedList';
import { getFieldId } from '../../../utils/issues';

const FilterField = withFieldConnector(withStoreConnector(Filter));

const NodePanel = ({ fieldId, ...rest }) => (
  <Item {...rest}>
    <Row>
      <h3>Panel title</h3>
      <p>The panel title will be shown above the list of nodes within the panel.</p>
      <ValidatedField
        name={`${fieldId}.title`}
        component={Fields.Text}
        placeholder="Panel title"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3
        id={getFieldId(`${fieldId}.dataSource`)}
        data-name="Panel data source"
      >Data source</h3>
      <p>
        Choose where the data for this panel should come from (either the in-progress interview
        session [&quot;People you have already named&quot;], or an external network data file
        that you have added).
      </p>
      <ValidatedField
        component={DataSource}
        name={`${fieldId}.dataSource`}
        validation={{ required: true }}
        canUseExisting
      />
    </Row>
    <Row>
      <h3>Filter <small>(optional)</small></h3>
      <p>
        You can (optionally) filter the data to be shown in this panel, by one or more rules
        using the options below.
      </p>
      <Field
        name={`${fieldId}.filter`}
        component={FilterField}
      />
    </Row>
  </Item>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { NodePanel };

export default NodePanel;
