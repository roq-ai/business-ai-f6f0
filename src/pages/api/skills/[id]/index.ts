import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { skillValidationSchema } from 'validationSchema/skills';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.skill
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSkillById();
    case 'PUT':
      return updateSkillById();
    case 'DELETE':
      return deleteSkillById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSkillById() {
    const data = await prisma.skill.findFirst(convertQueryToPrismaUtil(req.query, 'skill'));
    return res.status(200).json(data);
  }

  async function updateSkillById() {
    await skillValidationSchema.validate(req.body);
    const data = await prisma.skill.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSkillById() {
    const data = await prisma.skill.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
