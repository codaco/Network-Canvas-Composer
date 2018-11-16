import { get, reduce, isEmpty } from 'lodash';
import { withHandlers, compose } from 'recompose';
import { connect } from 'react-redux';
import { getValidations } from '../../../../../utils/validations';

const mapStateToProps = state => ({
  variableRegistry: get(state, 'protocol.present.variableRegistry', {}),
});

/**
 * Requires prop.nodeType
 */

const withValidation = compose(
  connect(mapStateToProps),
  withHandlers({
    validate: ({ variableRegistry, nodeType }) => (attributes) => {
      const variables = get(variableRegistry, ['node', nodeType, 'variables'], {});
      const allErrors = reduce(attributes, (errors, attribute, variable) => {
        const variableMeta = get(variables, variable, {});
        const validations = getValidations(get(variableMeta, 'validation', {}));
        const result = validations.reduce(
          (error, validate) => error || validate(attribute),
          undefined,
        );

        if (!result) { return errors; }

        return {
          ...errors,
          // variableMeta.name?
          [variable]: validations.reduce(
            (error, validate) => error || validate(attribute),
            undefined,
          ),
        };
      }, {});

      if (isEmpty(allErrors)) { return undefined; }

      return allErrors;
    },
  }),
);

export default withValidation;