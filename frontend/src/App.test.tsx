import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import { Repo } from './GitHubRepoList'

const mockRepos: Repo[] = [
  {
    id: 211666,
    name: 'node-v0.x-archive',
    full_name: 'nodejs/node-v0.x-archive',
    html_url: 'https://github.com/nodejs/node-v0.x-archive',
    description: 'Moved to https://github.com/nodejs/node',
    topics: [],
    stargazers_count: 34788,
    pushed_at: '2018-04-04T08:28:02Z',
  },
  {
    id: 21737266,
    name: 'awesome-nodejs',
    full_name: 'sindresorhus/awesome-nodejs',
    html_url: 'https://github.com/sindresorhus/awesome-nodejs',
    description: ':zap: Delightful Node.js packages and resources',
    topics: ['awesome', 'awesome-list', 'javascript', 'list', 'node', 'nodejs'],
    stargazers_count: 43517,
    pushed_at: '2022-01-23T09:49:22Z',
  },
]

const backend = setupServer(
  rest.get('/api/proxy/github/search/repositories', (req, res, ctx) => {
    let items = mockRepos
    switch (req.url.searchParams.get('page')) {
      case '1':
        items = [mockRepos[0]]
        break
      case '2':
        items = [mockRepos[1]]
        break
      default:
        items = []
        break
    }

    return res(
      ctx.json({
        total_count: 1000,
        incomplete_results: false,
        items,
      })
    )
  })
)

beforeAll(() => backend.listen())
afterAll(() => backend.close())
afterEach(() => backend.resetHandlers())

test('renders GitHub repositories list', async () => {
  render(<App />)

  await waitFor(() =>
    screen
      .getAllByRole('listitem')
      .find((item) => item.textContent?.includes(mockRepos[0].name))
  )

  fireEvent.click(screen.getByLabelText('Go to next page'))

  await waitFor(() =>
    screen
      .getAllByRole('listitem')
      .find((item) => item.textContent?.includes(mockRepos[1].name))
  )
})
