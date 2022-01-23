import 'dotenv-safe/config'
import App from './lib/app'

async function main() {
  const [app, setup] = App({
    host: process.env.HOST ?? 'localhost',
    port: process.env.PORT,
    debug: {
      request: ['error', 'uncaught'],
    },
  })

  await setup()
  await app.start()
  console.info(`Server running on ${app.info.uri}`)

  const teardown = async () => {
    console.info(`Shutting down`)
    await app.stop()
  }

  process.on('SIGINT', teardown)
  process.on('SIGTERM', teardown)
}

main()
