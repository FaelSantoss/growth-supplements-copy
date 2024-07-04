import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkTokenExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token = request.cookies.token
    if (!token) {
      return reply.status(401).send({ error: 'Token not provided' })
    }

    const user = await request.jwtVerify()
    request.user = user
  } catch (error) {
    reply.status(401).send({ error: 'Invalid token' })
  }
}
