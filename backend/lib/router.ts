import Hapi from '@hapi/hapi'

import inflateTree from './controller/tree-inflate'
import flattenTree from './controller/tree-flatten'
import githubApi from './controller/github-api'

export function registerRoutes(app: Hapi.Server) {
  app.route([
    {
      method: 'GET',
      path: '/',
      handler: () => ({ status: 'OK' }),
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
      path: '/api/proxy/github/{path*}',
      options: { ...githubApi, tags: ['api', 'GitHub Proxy API'] },
    },
  ])
}
