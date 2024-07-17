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
      name: z.string(),
      newName: z.string().optional(),
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

  app.get('/:productName', async (request, reply) => {
    const { productName } = request.params

    const product = await prisma.product.findFirst({
      where: { name: productName },
    })
    return product
  })

  app.post('/filter', async (request, reply) => {
    const filterProductBodySchema = z.object({
      productName: z.string().optional(),
      categoryName: z.string().optional(),
      priceMax: z.number().optional(),
      priceMin: z.number().optional(),
    })

    const { productName, categoryName, priceMax, priceMin } =
      filterProductBodySchema.parse(request.body)

    const whereClause: any = {}

    if (productName !== undefined) {
      whereClause.name = productName
    }

    if (categoryName !== undefined) {
      const category = await prisma.category.findUnique({
        where: { name: categoryName },
      })
      whereClause.categoryId = category?.id
    }

    if (priceMin !== undefined && priceMax !== undefined) {
      whereClause.price = {
        gte: priceMin,
        lte: priceMax,
      }
    } else if (priceMin !== undefined) {
      whereClause.price = {
        gte: priceMin,
      }
    } else if (priceMax !== undefined) {
      whereClause.price = {
        lte: priceMax,
      }
    }

    try {
      const productsQuery = {}

      if (Object.keys(whereClause).length > 0) {
        productsQuery.where = whereClause
      }

      const products = await prisma.product.findMany(productsQuery)

      return reply.send(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      return reply.status(500).send({ error: 'Failed to fetch products' })
    }
  })
}
