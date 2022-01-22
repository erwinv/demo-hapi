import Hapi, { ServerOptions } from '@hapi/hapi'
import H2o2 from '@hapi/h2o2'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiPino, { Options as PinoOptions } from 'hapi-pino'
import HapiSwagger, { RegisterOptions as SwaggerOptions } from 'hapi-swagger'
import { registerRoutes } from './router'

export default function App(options: ServerOptions = {}) {
  const server = Hapi.server(options)

  const setup = async () => {
    await server.register([H2o2, Inert, Vision])

    await server.register([
      {
        plugin: HapiPino,
        options: {
          prettyPrint: process.env.NODE_ENV !== 'production',
          redact: ['req.headers.authorization'],
          logPayload: true,
        } as PinoOptions,
      },
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: 'Hapi Demo',
          },
          grouping: 'tags',
          sortEndpoints: 'ordered',
        } as SwaggerOptions,
      },
    ])

    registerRoutes(server)
  }

  return [server, setup] as const
}
