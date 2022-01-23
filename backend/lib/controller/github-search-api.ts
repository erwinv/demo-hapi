import { join as joinPath } from 'path'
import { RouteOptions } from '@hapi/hapi'
import { ProxyHandlerOptions } from '@hapi/h2o2'
import Joi from 'joi'

const githubApiBaseUrl = new URL('https://api.github.com/')

const proxyGithubSearchApi: RouteOptions = {
  validate: {
    params: Joi.object({
      resource: Joi.string()
        .valid(
          'code',
          'commits',
          'issues',
          'labels',
          'repositories',
          'topics',
          'users'
        )
        .default('repositories'),
    }),
    query: Joi.object({
      q: Joi.string().default('nodejs'),
      sort: Joi.string().valid('stars', 'forks', 'help-wanted-issues'),
      order: Joi.string().valid('asc', 'desc'),
      per_page: Joi.number().default(10),
      page: Joi.number().default(1),
    }),
  },
  handler: {
    proxy: {
      mapUri: async (request) => {
        const proxyUrl = new URL(
          joinPath('/search', request.params.resource),
          githubApiBaseUrl
        )

        for (const [key, val] of Object.entries(request.query)) {
          proxyUrl.searchParams.set(key, val)
        }

        return {
          uri: proxyUrl.href,
          headers: {
            accept: 'application/vnd.github.v3+json',
            Authorization: `token ${process.env.GITHUB_OAUTH_TOKEN}`,
          },
        }
      },
      passThrough: true,
      xforward: true,
      ttl: 'upstream',
      // TODO (not applicable for Search API) handle ETag and Last-Modified
      // to make conditional requests (If-None-Match and If-Modified-Since)
    } as ProxyHandlerOptions,
  },
}

export default proxyGithubSearchApi
