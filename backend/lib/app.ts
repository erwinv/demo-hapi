import Hapi, { ServerOptions } from '@hapi/hapi'

export default function App(options: ServerOptions = {}) {
  const server = Hapi.server(options)

  // register route handlers

  return server
}
