import { FastifyInstance } from 'fastify'
import { prisma } from '../server'
import { z } from 'zod'

export async function cartRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createCartSchema = z.object({
      userId: z.number(),
    })

    const { userId } = createCartSchema.parse(request.body)

    try {
      const newCart = await prisma.cart.create({
        data: {
          userId,
        },
      })
      return reply.send(newCart)
    } catch (error) {
      return reply.status(500).send({ error: 'Error creating cart' })
    }
  })

  app.get('/', async (request, reply) => {
    try {
      const carts = await prisma.cart.findMany({
        include: { items: true },
      })
      return reply.send(carts)
    } catch (error) {
      return reply.status(500).send({ error: 'Error fetching carts' })
    }
  })

  app.get('/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string }

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId, 10) },
        include: { items: true },
      })
      if (cart) {
        return reply.send(cart)
      } else {
        return reply.status(404).send({ error: 'Cart not found' })
      }
    } catch (error) {
      return reply.status(500).send({ error: 'Error fetching cart' })
    }
  })

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const updateCartSchema = z.object({
      userId: z.number().optional(),
    })

    const data = updateCartSchema.parse(request.body)

    try {
      const updatedCart = await prisma.cart.update({
        where: { id: parseInt(id, 10) },
        data,
      })
      return reply.send(updatedCart)
    } catch (error) {
      return reply.status(500).send({ error: 'Error updating cart' })
    }
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      await prisma.cart.delete({
        where: { id: parseInt(id, 10) },
      })
      return reply.send({ message: 'Cart deleted successfully' })
    } catch (error) {
      return reply.status(500).send({ error: 'Error deleting cart' })
    }
  })
}
