import _ from 'lodash'
import nock from 'nock'
import App from './app'
import {
  normalizeTree,
  normalizeFlatTree,
  Tree,
  FlattenedTree,
} from './domain/tree'
import mockData from './domain/tree-example'

const [app, setup] = App()
const githubApiMock = nock('https://api.github.com')

beforeAll(async () => {
  await setup()
  await app.initialize()
})
afterAll(async () => {
  await app.stop()
})
afterEach(() => {
  try {
    githubApiMock.done()
  } finally {
    nock.cleanAll()
  }
})

it('POST /api/tree/inflate 400 Bad Request', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/tree/inflate',
    payload: {
      0: [],
    },
  })

  expect(response.statusCode).toBe(400)
})

it('POST /api/tree/inflate', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/tree/inflate',
    payload: mockData.flattenedTree,
  })

  expect(response.statusCode).toBe(200)
  expect(normalizeTree(response.result as Tree)).toMatchObject(
    normalizeTree(mockData.inflatedTree)
  )
})

it('POST /api/tree/flatten 400 Bad Request', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/tree/flatten',
    payload: {},
  })

  expect(response.statusCode).toBe(400)
})

it('POST /api/tree/flatten', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/tree/flatten',
    payload: mockData.inflatedTree,
  })

  expect(response.statusCode).toBe(200)
  expect(normalizeFlatTree(response.result as FlattenedTree)).toMatchObject(
    normalizeFlatTree(mockData.flattenedTree)
  )
})

it('GET /api/proxy/github/search/repositories', async () => {
  const githubApiReq = jest.fn()
  const mockGithubApiResponse = { repos: ['foo', 'bar', 'baz'] }

  githubApiMock
    .get('/search/repositories')
    .query({
      q: 'nodejs',
      per_page: 10,
      page: 1,
    })
    .reply(
      200,
      function () {
        expect(this.req.headers).toMatchObject({
          accept: 'application/vnd.github.v3+json',
          authorization: `token ${process.env.GITHUB_OAUT_TOKEN}`,
        })
        githubApiReq()
        return JSON.stringify(mockGithubApiResponse)
      },
      {
        'Content-Type': 'application/json',
      }
    )

  const response = await app.inject({
    method: 'GET',
    url: `/api/proxy/github/search/repositories?q=nodejs&per_page=10&page=1`,
  })

  expect(githubApiReq).toHaveBeenCalledTimes(1)
  expect(response.statusCode).toBe(200)
  expect(response.headers).toMatchObject({
    'content-type': expect.stringContaining('application/json'),
  })
  expect(JSON.parse(response.result as unknown as string)).toEqual(
    mockGithubApiResponse
  )
})
