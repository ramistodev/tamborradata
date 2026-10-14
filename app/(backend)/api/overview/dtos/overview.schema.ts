import { OverviewScope, overviewScope } from '../../../../types/api/overview.types';
import { ValidationError } from '../../../lib/errors';

export function checkParams(scope: OverviewScope | null): OverviewScope {
  if (!scope) {
    return overviewScope.both;
  }

  if (!Object.values(overviewScope).includes(scope)) {
    throw new ValidationError(`Invalid scope parameter: ${scope}`);
  }

  return scope;
}
