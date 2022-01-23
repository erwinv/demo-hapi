import _ from 'lodash'
import { inflate, flatten } from './tree'
import examples from './tree-example'

const inflatedTree = () => _.cloneDeep(examples.inflatedTree)
const flattenedTree = () => _.cloneDeep(examples.flattenedTree)

it(' inflate . flatten == flatten . inflate == identity', () => {
  expect(inflate(flatten(inflatedTree()))).toEqual(inflatedTree())

  expect(
    _.mapValues(flatten(inflate(flattenedTree())), (levelNodes) =>
      _.sortBy(levelNodes, 'id')
    )
  ).toEqual(flattenedTree())
})
