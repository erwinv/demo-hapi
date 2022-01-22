import { RouteOptions } from '@hapi/hapi'
import { ProxyHandlerOptions } from '@hapi/h2o2'

const githubApiBaseUrl = new URL('https://api.github.com/')

const searchGithubRepos: RouteOptions = {
  handler: {
    proxy: {
      mapUri: async (request) => {
        const proxyUrl = new URL(request.params.path, githubApiBaseUrl)

        for (const [key, val] of Object.entries(request.query)) {
          proxyUrl.searchParams.set(key, val)
        }

        return {
          uri: proxyUrl.href,
          headers: {
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

export default searchGithubRepos
