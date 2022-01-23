import _ from 'lodash'
import Joi from 'joi'
import examples from './tree-example'

const nodeSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string(),
  level: Joi.number(),
  parent_id: Joi.number().allow(null).required(),
})
  .unknown(true)
  .label('Node')

const levelNodesSchema = Joi.array().items(nodeSchema).label('LevelNodes')

export const flattenedTreeSchema = Joi.object({
  0: levelNodesSchema.length(1).required(),
  1: levelNodesSchema,
})
  .pattern(Joi.number().label('levelId'), levelNodesSchema)
  .label('FlattenedTree')
  .example(examples.flattenedTree)

export const treeSchema = nodeSchema
  .keys({
    children: Joi.array().items(nodeSchema, Joi.link('#tree')),
  })
  .id('tree')
  .label('Tree')
  .example(examples.inflatedTree)

export interface Node {
  id: number
  level: number
  title: string
  parent_id: number | null
}

export type Tree = Node & {
  children: Tree[]
}

export interface RawNode extends Node {
  children: []
}

export interface FlattenedTree {
  [levelId: `${number}`]: RawNode[]
}

export function inflate(flattenedTree: FlattenedTree): Tree {
  const allNodes: RawNode[] = Object.values(flattenedTree).flat()

  const nodeMap = new Map(
    allNodes.map((node) => [node.id, node as Tree] as const)
  )

  const rootId = flattenedTree['0']?.[0].id

  const childrenGroupedByParent = _.groupBy(
    allNodes.filter((node) => _.isNumber(node.parent_id)),
    'parent_id'
  )

  for (const parentId of Object.keys(childrenGroupedByParent)) {
    const parent = nodeMap.get(Number(parentId))
    const children = childrenGroupedByParent[parentId]

    if (!parent) continue
    if (!parent.children) parent.children = []

    parent.children.push(...children)
  }

  return (nodeMap.get(rootId) as Tree) ?? {}
}

export function flatten(tree: Tree): FlattenedTree {
  const allNodes = [...walk(tree)]
  return _.groupBy(allNodes, 'level')
}

function* walk(tree: Tree, level = 0): Iterable<RawNode> {
  if (level === 0) yield withLevel(withoutChildren(tree), level)

  if (tree.children?.length > 0) {
    for (const child of tree.children) {
      yield withLevel(withoutChildren(child), level + 1)
    }
    for (const node of tree.children) {
      yield* walk(node, level + 1)
    }
  }
}

function withoutChildren<N extends Node>(node: N): RawNode {
  return { ...node, children: [] }
}

function withLevel<N extends Node>(node: N, level: number): N {
  if (_.isNumber(node.level)) {
    return node
  }

  return { ...node, level }
}
