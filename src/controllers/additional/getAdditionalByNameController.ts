import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetAdditionalByNameController {
  async handle(
    req: Request,
    res: Response,
    additionalName: string,
    additionalPrice: number
  ) {
    try {
      const additional = await prisma.additional.findMany({
        where: {
          AND: [{ name: additionalName }, { price: additionalPrice }],
        },
        take: 1,
      });

      return additional.length > 0 ? additional[0].id : undefined;
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

export const getAdditionalByNameController =
  new GetAdditionalByNameController();
