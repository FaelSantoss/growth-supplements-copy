import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'

import { PrismaClient } from '@prisma/client'

import { usersRoutes } from './routes/users'
import { productRoutes } from './routes/products'
import { categoryRoutes } from './routes/category'
import { cartRoutes } from './routes/cart'
import { cartItemsRoutes } from './routes/cartItems'
import { addressRoutes } from './routes/address'

export const prisma = new PrismaClient()

const app = fastify()

app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

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

app.register(productRoutes, {
  prefix: 'products',
})

app.register(categoryRoutes, {
  prefix: 'category',
})

app.register(cartRoutes, {
  prefix: 'carts',
})

app.register(cartItemsRoutes, {
  prefix: 'cart-items',
})

app.register(addressRoutes, {
  prefix: 'address',
})

app
  .listen({
    port: 3001,
  })
  .then(() => {
    console.log('HTTP server running')
  })
  .catch((err: Error) => {
    app.log.error(err)
    process.exit(1)
  })
