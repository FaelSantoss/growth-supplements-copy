import fastify from 'fastify'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('HTTP server running')
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
