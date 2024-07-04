import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import { checkTokenExists } from '../middlewares/check-token-exists'

const prisma = new PrismaClient()

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await prisma.user.findMany()
    return users
  })

  app.get(
    '/delete',
    {
      preHandler: [checkTokenExists],
    },
    async (request, reply) => {
      const user = request.user
      const { id } = user

      try {
        await prisma.user.delete({
          where: { id },
        })
        return reply.send({ message: 'User deleted successfully', user })
      } catch (error) {
        return reply.status(500).send({ error: 'User deletion failed' })
      }
    },
  )

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
        const token = app.jwt.sign({ id: user.id, email: user.email })

        reply.setCookie('token', token, {
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'None',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })

        return reply.send({ message: 'Login successful', token })
      } else {
        return reply.status(401).send({ error: 'Invalid email or password' })
      }
    } catch (error) {
      reply.status(500).send({ error: 'Unable to login' })
    }
  })

  app.post('/reset-password', async (request, reply) => {
    const resetPasswordSchema = z
      .object({
        email: z.string().email({ message: 'Invalid email address' }),
        newPassword: z.string().refine(
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
        confirmNewPassword: z.string(),
      })
      .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords don't match",
        path: ['confirmNewPassword'],
      })

    const { email, newPassword } = resetPasswordSchema.parse(request.body)

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      })
      return reply.send(updatedUser)
    } catch (error) {
      return reply.status(500).send({ error: 'Unable to update password' })
    }
  })
}
