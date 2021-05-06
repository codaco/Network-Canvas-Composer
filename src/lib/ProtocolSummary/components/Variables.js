import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { toPairs, get, find } from 'lodash';
import SummaryContext from './SummaryContext';

const getStageName = (protocol) => (stageId) => {
  const stageConfiguration = find(protocol.stages, ['id', stageId]);
  return get(stageConfiguration, 'label');
};

const usedIn = (protocol, index) => (variableId) => {
  const stages = get(
    index.find(({ id }) => id === variableId),
    'stages',
    [],
  );

  return stages.map((stageId) => getStageName(protocol)(stageId));
};

const Variables = ({ variables }) => {
  const {
    protocol,
    index,
  } = useContext(SummaryContext);

  return (
    <div className="protocol-summary-variables">
      <h2>Variables</h2>

      <table className="protocol-summary-variables__data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Input Component</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {toPairs(variables).map(([variableId, variableConfiguration]) => {
            const {
              name,
              component,
              type,
            } = variableConfiguration;

            return (
              <tr key={variableId}>
                <td>{name}</td>
                <td>{type}</td>
                <td>{component}</td>
                <td>
                  {usedIn(protocol, index)(variableId).map((stageName) => (
                    <>
                      {stageName}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Variables.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

export default Variables;
