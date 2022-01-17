import { RouteOptions } from '@hapi/hapi'
import { flatten, Tree } from '../domain/tree'

// const nodeSchema = Joi.object({
//   id: Joi.number().required(),
//   title: Joi.string().min(1).required(),
//   level: Joi.number().required(),
//   children: Joi.array().length(0),
//   parent_id: Joi.number().allow(null).required(),
// })
// const nodesSchema = Joi.array().items(nodeSchema).min(1)
// const flattenedTreeSchema = Joi.object().pattern(/^\d+$/, nodesSchema).min(1)

// TODO validation
const flattenTree: RouteOptions = {
  handler: (request) => {
    return flatten(request.payload as Tree)
  },
}

export default flattenTree
