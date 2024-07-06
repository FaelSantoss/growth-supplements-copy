import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../server'

export async function productRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const products = await prisma.product.findMany()
    return products
  })

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

  app.delete('/delete', async (request, reply) => {
    const deleteProductBodySchema = z.object({
      name: z.string(),
    })

    const { name } = deleteProductBodySchema.parse(request.body)
    try {
      const product = await prisma.product.findFirst({
        where: {
          name,
        },
      })
      await prisma.product.delete({
        where: {
          id: product?.id,
        },
      })
      return reply.send({ message: 'Product deleted successfully', product })
    } catch (error) {
      return reply.status(500).send({ error: 'Product deletion failedaa' })
    }
  })

  app.put('/update', async (request, reply) => {
    const updateProductBodySchema = z.object({
      name: z.string(), // Usado para identificar o produto a ser atualizado
      newName: z.string().optional(), // Novo nome do produto, se aplicável
      description: z.string().optional(),
      price: z.number().optional(),
      imageUrl: z.string().optional(),
      stock: z.number().int().optional(),
      categoryName: z.string().optional(),
    })

    const { name, ...parsedBody } = updateProductBodySchema.parse(request.body)

    const updateData: Record<string, unknown> = {}
    if (parsedBody.newName) updateData.name = parsedBody.newName
    if (parsedBody.description) updateData.description = parsedBody.description
    if (parsedBody.price) updateData.price = parsedBody.price
    if (parsedBody.imageUrl) updateData.imageUrl = parsedBody.imageUrl
    if (parsedBody.stock) updateData.stock = parsedBody.stock

    try {
      if (parsedBody.categoryName) {
        const category = await prisma.category.findUnique({
          where: { name: parsedBody.categoryName },
        })
        if (!category) {
          return reply.status(404).send({ error: 'Category not found' })
        }
        updateData.categoryId = category.id
      }

      const product = await prisma.product.findFirst({
        where: { name },
      })
      if (!product) {
        return reply.status(404).send({ error: 'Named not found' })
      }

      const updatedProduct = await prisma.product.update({
        where: { id: product?.id },
        data: updateData,
      })
      reply.send(updatedProduct)
    } catch (error) {
      console.error('Error updating product:', error)
      reply.status(500).send({ error: 'Failed to update product' })
    }
  })
}
