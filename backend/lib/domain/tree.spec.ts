import _ from 'lodash'
import {
  inflate,
  flatten,
  FlattenedTree,
  Tree,
  normalizeTree,
  normalizeFlatTree,
} from './tree'
import examples from './tree-example'

const { inflatedTree, flattenedTree } = examples

it('inflate', () => {
  expect(normalizeTree(inflate(flattenedTree))).toEqual(
    normalizeTree(inflatedTree)
  )
})

it('flatten', () => {
  expect(normalizeFlatTree(flatten(inflatedTree))).toEqual(
    normalizeFlatTree(flattenedTree)
  )
})

it('inflate . flatten == identity', () => {
  const inflateAfterFlatten = (tree: Tree) => inflate(flatten(tree))

  expect(normalizeTree(inflateAfterFlatten(inflatedTree))).toEqual(
    normalizeTree(inflatedTree)
  )
})

it('flatten . inflate == identity', () => {
  const flattenAfterInflate = (flatTree: FlattenedTree) =>
    flatten(inflate(flatTree))

  expect(normalizeFlatTree(flattenAfterInflate(flattenedTree))).toEqual(
    normalizeFlatTree(flattenedTree)
  )
})
