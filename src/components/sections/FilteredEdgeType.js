import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const FilteredEdgeType = (props) => (
  <Section>
    <Row>
      <EdgeTypeFields
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Row>
    <NetworkFilter
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      title="Enable stage-level network filtering"
    />
  </Section>
);

export default FilteredEdgeType;
