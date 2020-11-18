import { identity } from 'lodash'
import { parse } from 'qs'
import { ServiceRequest } from '@microfleet/core'

import Lifecycle from '../../lifecycle'

type QSParserAugmentedAction = ServiceRequest & {
  action: ServiceRequest['action'] & {
    transformQuery?: (...args: any[]) => any;
    transformOpts?: any;
  };
}

async function preValidate(request: QSParserAugmentedAction): Promise<any> {
  const { query } = request

  // if present - remap, otherwise just noop
  if (query) {
    const { action } = request
    const { transformQuery = identity, transformOpts } = action

    // eslint-disable-next-line no-param-reassign
    request.query = transformQuery(parse(query, {
      depth: 1,
      parameterLimit: 10,
      parseArrays: false,
      ...transformOpts,
    }))
  }
}

export default [{
  handler: preValidate,
  point: Lifecycle.points.preValidate,
}]
