import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { transporter } from '../middlewares/nodemailer'
import crypto from 'crypto'

import { prisma } from '../server'
import { checkTokenExists } from '../middlewares/check-token-exists'

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
      if (newUser) {
        const token = app.jwt.sign({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        })

        reply.setCookie('token', token, {
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'None',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })

        await prisma.cart.create({
          data: {
            userId: newUser.id,
          },
        })
        return reply.send({ token })
      }
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
        const token = app.jwt.sign({
          id: user.id,
          email: user.email,
          name: user.name,
        })

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

  app.post('/request-password-reset', async (request, reply) => {
    const resetPasswordSchema = z.object({
      email: z.string().email({ message: 'Invalid email address' }),
    })

    const { email } = resetPasswordSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return reply.status(404).send({ message: 'User not found' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')

    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hora
      },
    })

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`
    const mailOptions = {
      from: 'fael00992@gmail.com',
      to: email,
      subject: 'Redefinição de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="text-align: center; color: #333;">Redefinição de Senha</h2>
          <p style="text-align: center; color: #555;">
            Você solicitou a redefinição de senha. Clique no botão abaixo para redefinir sua senha:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetURL}" 
               style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Redefinir Senha
            </a>
          </div>
          <p style="text-align: center; color: #555;">
            Se você não solicitou essa redefinição, por favor ignore este e-mail.
          </p>
          <p style="text-align: center; color: #555;">
            Atenciosamente,<br />Sua Equipe de Suporte
          </p>
        </div>
      `,
    }

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return reply.status(500).send({ message: 'Error sending email' })
      }
      reply.send({ message: 'Password reset email sent' })
    })
  })

  app.post('/reset-password/:token', async (request, reply) => {
    const { token } = request.params
    const { newPassword } = request.body

    const passwordReset = await prisma.passwordReset.findFirst({
      where: { token },
    })

    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      return reply.status(400).send({ message: 'Invalid or expired token' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email: passwordReset.email },
      data: { password: hashedPassword },
    })

    await prisma.passwordReset.deleteMany({
      where: { token },
    })

    reply.send({ message: 'Password has been reset' })
  })
}
