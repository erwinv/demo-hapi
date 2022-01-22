import Hapi, { ServerOptions } from '@hapi/hapi'
import H2o2 from '@hapi/h2o2'
import Pino, { Options as PinoOptions } from 'hapi-pino'
import { registerRoutes } from './router'

export default function App(options: ServerOptions = {}) {
  const server = Hapi.server(options)

  const setup = async () => {
    await server.register({
      plugin: Pino,
      options: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        redact: ['req.headers.authorization'],
        logPayload: true,
      } as PinoOptions,
    })
    await server.register(H2o2)
    registerRoutes(server)
  }

  return [server, setup] as const
}
