import App from './lib/app'

async function main() {
  const app = App({
    host: process.env.HOST,
    port: process.env.PORT,
  })

  await app.start()
  console.info(`Server running on ${app.info.uri}`)

  const teardown = async () => {
    await app.stop()
  }

  process.on('SIGINT', teardown)
  process.on('SIGTERM', teardown)
}

main()
