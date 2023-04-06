import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetAdditionalByCompanyController {
  async handle(req: Request, res: Response) {
    try {
      const additional = await prisma.additional.findMany({
        where: {
          companyId: req.params.companyId,
        },
      });

      if (additional.length > 0) {
        return res.status(200).json(additional);
      } else {
        return res.status(404).send('Additional not found!');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      } else {
        console.log(error);
        return error;
      }
    }
  }
}

export const getAdditionalByCompanyController =
  new GetAdditionalByCompanyController();
