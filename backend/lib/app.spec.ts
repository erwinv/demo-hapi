import _ from 'lodash'
import App from './app'
import mockData from './domain/tree-example'

const [app, setup] = App()

beforeAll(async () => {
  await setup()
  await app.initialize()
})
afterAll(async () => {
  await app.stop()
})

it('GET /', async () => {
  const response = await app.inject('/')
  expect(response).toMatchObject({
    statusCode: 200,
    result: { status: 'OK' },
  })
})

it('POST /api/tree/inflate', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/tree/inflate',
    payload: mockData.flattenedTree,
  })

  expect(response.statusCode).toBe(200)
  expect(response.result).toMatchObject(mockData.inflatedTree)
})

it('POST /api/tree/flatten', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/tree/flatten',
    payload: mockData.inflatedTree,
  })

  expect(response.statusCode).toBe(200)
  expect(
    _.mapValues(response.result, (nodes) => _.sortBy(nodes, 'id'))
  ).toMatchObject(mockData.flattenedTree)
})
