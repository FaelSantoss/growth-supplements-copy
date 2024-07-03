import { FastifyRequest } from 'fastify'

export async function checkTokenExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = await request.jwtVerify()

  if (!token) {
    return reply.send({
      error: 'Unauthorized',
    })
  }
}
