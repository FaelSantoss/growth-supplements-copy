import fastify from 'fastify'
import fastifyJWT from 'fastify-jwt'
import fastifyCookie from 'fastify-cookie'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(fastifyCookie)

app.register(fastifyJWT, {
  secret: 'your-secret-key',
  cookie: {
    cookieName: 'token',
  },
})

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
  .catch((err: Error) => {
    app.log.error(err)
    process.exit(1)
  })
