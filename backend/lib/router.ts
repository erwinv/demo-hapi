import Hapi from '@hapi/hapi'

import inflateTree from './controller/tree-inflate'
import flattenTree from './controller/tree-flatten'
import proxyGithubSearchApi from './controller/github-search-api'

export function registerRoutes(app: Hapi.Server) {
  app.route([
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: {
          path: '.',
          index: true,
        },
      },
    },
    {
      method: 'POST',
      path: '/api/tree/inflate',
      options: {
        ...inflateTree,
        tags: ['api', 'Tree API'],
        description:
          'Inflate tree (reconstruct tree from flat record of nodes grouped by level)',
        plugins: {
          'hapi-swagger': { order: 1 },
        },
      },
    },
    {
      method: 'POST',
      path: '/api/tree/flatten',
      options: {
        ...flattenTree,
        tags: ['api', 'Tree API'],
        description:
          'Flatten tree (group nodes by level into a flat record of nodes)',
        plugins: {
          'hapi-swagger': { order: 2 },
        },
      },
    },
    {
      method: 'GET',
      path: '/api/proxy/github/search/{resource}',
      options: {
        ...proxyGithubSearchApi,
        tags: ['api', 'GitHub Search API Proxy'],
      },
    },
  ])
}
