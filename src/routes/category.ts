import { FastifyInstance } from 'fastify'
import { string, z } from 'zod'

import { prisma } from '../server'

export async function categoryRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const categorys = await prisma.category.findMany()
    return categorys
  })

  app.post('/create', async (request, reply) => {
    const createCategoryBodySchema = z.object({
      name: string(),
    })

    const { name } = createCategoryBodySchema.parse(request.body)
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    })
    reply.send(newCategory)
  })

  app.delete('/delete', async (request, reply) => {
    const createCategoryBodySchema = z.object({
      name: string(),
    })

    const { name } = createCategoryBodySchema.parse(request.body)
    try {
      await prisma.category.delete({
        where: { name },
      })
      return reply.send({ message: 'Category deleted successfully', name })
    } catch (error) {
      return reply.status(500).send({ error: 'Category deletion failed' })
    }
  })

  app.put('/update', async (request, reply) => {
    const updateCategoryBodyShema = z.object({
      name: string(),
      newName: string(),
    })

    const { name, newName } = updateCategoryBodyShema.parse(request.body)

    try {
      const updateCategory = await prisma.category.update({
        where: { name },
        data: { name: newName },
      })
      return reply.send(updateCategory)
    } catch {
      return reply.status(500).send({ error: 'Unable  to update category' })
    }
  })
}
