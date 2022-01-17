import { RouteOptions } from '@hapi/hapi'
import Joi from 'joi'
import { FlattenedTree, inflate, RawNode } from '../domain/tree'

const nodeSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().min(1).required(),
  level: Joi.number().required(),
  children: Joi.array().length(0),
  parent_id: Joi.number().allow(null).required(),
})
const nodesSchema = Joi.array().items(nodeSchema).min(1)
const flattenedTreeSchema = Joi.object().pattern(/^\d+$/, nodesSchema).min(1)

const inflateTree: RouteOptions = {
  validate: {
    payload: async (value) => {
      const flattenedTree: FlattenedTree =
        await flattenedTreeSchema.validateAsync(value)

      // Assert that there is 1 and only 1 root node
      if (flattenedTree['0'].length !== 1) throw new Error()

      const allNodes = new Map<string, RawNode>()

      // Validate every node.level matches the root object's key of its container array
      // Example of invalid level:
      // {
      //   "1": [{
      //     level: 2, // should be 1
      //   }]
      // }
      for (const level of Object.keys(flattenedTree)) {
        const thisLevelNodes = flattenedTree[level as keyof FlattenedTree]
        if (!thisLevelNodes.every((node) => node.level === Number(level))) {
          throw new Error()
        }
        for (const node of thisLevelNodes) {
          const id = `${node.id}`
          if (allNodes.has(id)) throw new Error() // id collision
          allNodes.set(id, node)
        }
      }

      // Validate heirarchy (parent's level is node.level - 1)
      // Example of invalid level:
      // {
      //   "1": [{
      //     parent_id: 2, // invalid parent, parent's level should be 0
      //   }],
      //   "2": [{
      //     id: 2,
      //     level: 2,
      //   }]
      // }
      for (const node of Object.values(allNodes)) {
        if (node.level === 0) {
          if (node.parent_id !== null) throw new Error()
          continue
        }

        const parentNode = allNodes.get(`${node.parent_id}`)
        if (parentNode?.level !== node.level - 1) throw new Error()
      }

      return flattenedTree
    },
  },
  handler: (request) => {
    return inflate(request.payload as FlattenedTree)
  },
}

export default inflateTree
