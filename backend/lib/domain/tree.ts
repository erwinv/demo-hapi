import _ from 'lodash'

export interface TreeNode {
  id: number
  level: number
  title: string
  parent_id: number
}

export type Tree = TreeNode & {
  children: Tree[]
}

export interface RawNode extends TreeNode {
  children: []
}

export interface FlattenedTree {
  [level: `${number}`]: RawNode[]
}

export function inflate(flattenedTree: FlattenedTree): Tree {
  const allNodes = new Map<number, Tree>()
  Object.values(flattenedTree)
    .flat()
    .forEach((node: RawNode) => {
      allNodes.set(node.id, node)
    })

  let rootId = 0

  for (const level of Object.keys(flattenedTree)) {
    if (level === '0') {
      rootId = flattenedTree[level][0].id
      continue
    }

    const thisLevelNodes = flattenedTree[level as keyof FlattenedTree]

    const childrenGroupedByParent = _.groupBy(thisLevelNodes, 'parent_id')

    for (const parentId of Object.keys(childrenGroupedByParent)) {
      const parent = allNodes.get(Number(parentId)) as Tree
      parent.children = childrenGroupedByParent[parentId]
    }
  }

  return allNodes.get(rootId) as Tree
}

export function flatten(tree: Tree): FlattenedTree {
  const flattenedTree = {} as FlattenedTree
  for (const nodes of walk(tree)) {
    const levelId = `${nodes[0].level}` as keyof FlattenedTree
    if (!flattenedTree[levelId]) flattenedTree[levelId] = []
    flattenedTree[levelId].push(...nodes)
  }
  return flattenedTree
}

function* walk(tree: Tree): Iterable<RawNode[]> {
  if (tree.level === 0) yield [withoutChildren(tree)]

  if (tree.children.length > 0) {
    yield tree.children.map(withoutChildren)
    for (const node of tree.children) {
      yield* walk(node)
    }
  }
}

function withoutChildren(tree: Tree): RawNode {
  return { ...tree, children: [] }
}
