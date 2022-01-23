import { RouteOptions } from '@hapi/hapi'
import {
  flattenedTreeSchema,
  treeSchema,
  inflate,
  FlattenedTree,
} from '../domain/tree'

const inflateTree: RouteOptions = {
  validate: {
    payload: flattenedTreeSchema,
    failAction: (_, __, err) => {
      throw err
    },
  },
  response: {
    schema: treeSchema,
  },
  handler: (request) => {
    return inflate(request.payload as FlattenedTree)
  },
}

export default inflateTree
