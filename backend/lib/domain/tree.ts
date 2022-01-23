import _ from 'lodash'
import Joi from 'joi'
import examples from './tree-example'

const nodeSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string(),
  level: Joi.number(),
  parent_id: Joi.number().allow(null),
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
  title?: string
  level?: number
  parent_id?: number | null
}

export type Tree = Node & {
  children?: Tree[]
}

export interface FlatNode extends Node {
  children?: []
}

export interface FlattenedTree {
  [levelId: `${number}`]: FlatNode[]
}

export function inflate(flattenedTree: FlattenedTree): Tree {
  const allNodes: FlatNode[] = Object.values(flattenedTree).flat().map(_.clone)

  const nodeMap = new Map(
    allNodes.map((node) => [node.id, node as Tree] as const)
  )

  const rootId = flattenedTree['0'][0].id
  const treeRoot = nodeMap.get(rootId)
  if (!treeRoot) throw new Error('Missing root node')

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

  return treeRoot
}

export function flatten(tree: Tree): FlattenedTree {
  const allNodes = [...walk(tree, withLevelAndParentId)].map(toFlatNode)
  return _.groupBy(allNodes, 'level')
}

type TraversalCallback<R> = (
  tree: Tree,
  level: number,
  parentId: number | null
) => R

function* walk<R>(
  tree: Tree,
  cb: TraversalCallback<R>,
  level = 0
): Iterable<R> {
  if (level === 0) yield cb(tree, level, null)

  if (tree.children?.length ?? -Infinity > 0) {
    for (const child of tree.children ?? []) {
      yield cb(child, level + 1, tree.id)
    }

    for (const child of tree.children ?? []) {
      yield* walk(child, cb, level + 1)
    }
  }
}

function toFlatNode(node: Tree): FlatNode {
  return { ...node, children: [] }
}

function withLevelAndParentId<N extends Node>(
  node: N,
  level: number,
  parent_id: number | null
): N {
  return { ...node, level, parent_id }
}

/**
 * Remove parent_id, level, and empty children from tree (primarily to aid deep equality)
 * @param tree
 * @returns normalized tree
 */
export function normalizeTree(tree: Tree) {
  const clone = _.cloneDeep(tree)
  for (const node of walk(clone, (tree) => tree)) {
    delete node.parent_id
    delete node.level
    if (node.children?.length === 0) {
      delete node.children
    } else {
      node.children?.sort((n1, n2) => n1.id - n2.id)
    }
  }
  return clone
}

/**
 * Remove level and children from flattened tree (primarily to aid deep equality)
 * @param flatTree
 * @returns normalized flattened tree
 */
export function normalizeFlatTree(flatTree: FlattenedTree) {
  return _.mapValues(flatTree, (levelNodes) =>
    _.sortBy(levelNodes, 'id').map((node) => _.omit(node, 'level', 'children'))
  )
}
