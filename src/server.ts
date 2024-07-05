import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { productRoutes } from './routes/products'
import { categoryRoutes } from './routes/category'

export const prisma = new PrismaClient()

const app = fastify()

app.register(fastifyCookie)

app.register(fastifyJwt, {
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
