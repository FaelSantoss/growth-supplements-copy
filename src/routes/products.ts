import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../server'

export async function productRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createProductBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      imageUrl: z.string(),
      stock: z.number().int(),
      categoryName: z.string(),
    })

    const { name, description, price, imageUrl, stock, categoryName } =
      createProductBodySchema.parse(request.body)

    try {
      const category = await prisma.category.findUnique({
        where: {
          name: categoryName,
        },
      })
      if (category) {
        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price,
            imageUrl,
            stock,
            categoryId: category.id,
          },
        })
        reply.send(newProduct)
      }
    } catch (error) {
      reply.status(500).send({ error: 'Unable to create product' })
    }
  })
}
