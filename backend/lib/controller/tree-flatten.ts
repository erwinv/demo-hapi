import { RouteOptions } from '@hapi/hapi'
import { treeSchema, flattenedTreeSchema, flatten, Tree } from '../domain/tree'

const flattenTree: RouteOptions = {
  validate: {
    payload: treeSchema,
    failAction: (_, __, err) => {
      throw err
    },
  },
  response: {
    schema: flattenedTreeSchema,
  },
  handler: (request) => {
    return flatten(request.payload as Tree)
  },
}

export default flattenTree
