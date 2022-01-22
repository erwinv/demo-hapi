import { RouteOptions } from '@hapi/hapi'
import { treeSchema, flattenedTreeSchema, flatten, Tree } from '../domain/tree'

const flattenTree: RouteOptions = {
  validate: {
    payload: treeSchema,
  },
  response: {
    schema: flattenedTreeSchema,
  },
  handler: (request) => {
    return flatten(request.payload as Tree)
  },
}

export default flattenTree
