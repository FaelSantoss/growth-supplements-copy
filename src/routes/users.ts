import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string().refine(
        (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
            value,
          )
        },
        {
          message:
            'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one symbol',
        },
      ),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
      reply.send(newUser)
      return newUser
    } catch (error) {
      reply.status(500).send({ error: 'Unable to create user' })
    }
  })

  app.post('/login', async (request, reply) => {
    const loginUserSchema = z.object({
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string(),
    })

    const { email, password } = loginUserSchema.parse(request.body)

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (user && (await bcrypt.compare(password, user.password))) {
        return reply.send({ message: 'Login successful', user })
      } else {
        return reply.status(401).send({ error: 'Invalid email or password' })
      }
    } catch (error) {
      reply.status(500).send({ error: 'Unable to login' })
    }
  })
}
