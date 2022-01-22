import _ from 'lodash'
import App from './app'

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

const mockData = {
  flattenedTree: {
    '0': [{ id: 10, title: 'House', level: 0, children: [], parent_id: null }],
    '1': [
      { id: 12, title: 'Red Roof', level: 1, children: [], parent_id: 10 },
      { id: 13, title: 'Wall', level: 1, children: [], parent_id: 10 },
      { id: 18, title: 'Blue Roof', level: 1, children: [], parent_id: 10 },
    ],
    '2': [
      { id: 15, title: 'Red Window', level: 2, children: [], parent_id: 12 },
      { id: 16, title: 'Door', level: 2, children: [], parent_id: 13 },
      { id: 17, title: 'Blue Window', level: 2, children: [], parent_id: 12 },
    ],
  },
  inflatedTree: {
    id: 10,
    title: 'House',
    level: 0,
    parent_id: null,
    children: [
      {
        id: 12,
        title: 'Red Roof',
        level: 1,
        parent_id: 10,
        children: [
          {
            id: 15,
            title: 'Red Window',
            level: 2,
            children: [],
            parent_id: 12,
          },
          {
            id: 17,
            title: 'Blue Window',
            level: 2,
            children: [],
            parent_id: 12,
          },
        ],
      },
      {
        id: 13,
        title: 'Wall',
        level: 1,
        parent_id: 10,
        children: [
          { id: 16, title: 'Door', level: 2, children: [], parent_id: 13 },
        ],
      },
      {
        id: 18,
        title: 'Blue Roof',
        level: 1,
        parent_id: 10,
        children: [],
      },
    ],
  },
}

it('POST /tree/inflate', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/tree/inflate',
    payload: mockData.flattenedTree,
  })

  expect(response.statusCode).toBe(200)
  expect(response.result).toMatchObject(mockData.inflatedTree)
})

it('POST /tree/flatten', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/tree/flatten',
    payload: mockData.inflatedTree,
  })

  expect(response.statusCode).toBe(200)
  expect(
    _.mapValues(response.result, (nodes) => _.sortBy(nodes, 'id'))
  ).toMatchObject(mockData.flattenedTree)
})
