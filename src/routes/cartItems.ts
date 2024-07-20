import { FastifyInstance } from 'fastify'
import { prisma } from '../server'
import { z } from 'zod'

export async function cartItemsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createCartItemSchema = z.object({
      quantity: z.number().min(1),
      productId: z.number(),
      userId: z.number(),
    })

    const { quantity, productId, userId } = createCartItemSchema.parse(
      request.body,
    )
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      })
      try {
        if (cart !== null) {
          const newCartItem = await prisma.cartItem.create({
            data: {
              quantity,
              productId,
              cartId: cart?.id,
            },
          })
          return reply.send(newCartItem)
        }
      } catch (error) {
        return reply.status(500).send({ error: 'Error adding item to cart' })
      }
    } catch (error) {
      return reply.status(500).send({ error: 'Cart not found' })
    }
  })

  app.get('/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string }

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId, 10) },
      })
      try {
        if (cart) {
          const cartItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
          })
          return reply.send(cartItems)
        }
      } catch (error) {
        return reply.status(500).send({ error: 'Error fetching cart items' })
      }
    } catch (error) {
      return reply.status(500).send({ error: 'Cart not found' })
    }
  })

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const updateCartItemSchema = z.object({
      quantity: z.number().min(1).optional(),
    })

    const data = updateCartItemSchema.parse(request.body)

    try {
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: parseInt(id, 10) },
        data,
      })
      return reply.send(updatedCartItem)
    } catch (error) {
      return reply.status(500).send({ error: 'Error updating cart item' })
    }
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      await prisma.cartItem.delete({
        where: { id: parseInt(id, 10) },
      })
      return reply.send({ message: 'Cart item deleted successfully' })
    } catch (error) {
      return reply.status(500).send({ error: 'Error deleting cart item' })
    }
  })
}
