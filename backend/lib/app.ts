import Hapi, { ServerOptions } from '@hapi/hapi'
import { registerRoutes } from './router'

export default function App(options: ServerOptions = {}) {
  const server = Hapi.server(options)

  registerRoutes(server)

  return server
}
