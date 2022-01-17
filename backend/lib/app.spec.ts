import App from './app'

const app = App()

beforeAll(async () => {
  await app.initialize()
})
afterAll(async () => {
  await app.stop()
})

it('GET /', async () => {
  const response = await app.inject('/')
  expect(response.statusCode).toBe(404)
})
