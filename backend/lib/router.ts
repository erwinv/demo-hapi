import Hapi from '@hapi/hapi'

import inflateTree from './controller/tree-inflate'
import flattenTree from './controller/tree-flatten'
import githubApi from './controller/github-api'

export function registerRoutes(app: Hapi.Server) {
  app.route([
    { method: 'GET', path: '/', handler: () => ({ status: 'OK' }) },
    { method: 'POST', path: '/tree/inflate', options: inflateTree },
    { method: 'POST', path: '/tree/flatten', options: flattenTree },
    {
      method: '*',
      path: '/api/github/{path*}',
      options: githubApi,
    },
  ])
}
