import { FastifyInstance } from 'fastify'
import { prisma } from '../server'
import { z } from 'zod'

export async function addressRoutes(app: FastifyInstance) {
  app.post('/:id', async (request, reply) => {
    const createAddressSchema = z.object({
      road: z.string(),
      number: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      cep: z.string(),
      complement: z.string().optional(),
    })

    const { id } = request.params as { id: string }
    const { road, number, neighborhood, city, state, cep, complement } =
      createAddressSchema.parse(request.body)

    try {
      const newAddress = await prisma.address.create({
        data: {
          road,
          number,
          neighborhood,
          city,
          state,
          cep,
          complement,
          userId: parseInt(id, 10),
        },
      })
      return reply.send(newAddress)
    } catch (error) {
      return reply.status(500).send({ error: 'Error create address' })
    }
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const address = await prisma.address.findMany({
        where: { userId: parseInt(id, 10) },
      })
      return reply.send(address)
    } catch (error) {
      return reply.status(500).send({ error: 'Error fetching address' })
    }
  })
}
