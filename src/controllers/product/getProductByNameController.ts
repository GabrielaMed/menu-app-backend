import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetProductByNameController {
  async handle(req: Request, res: Response, productName: string) {
    try {
      const product = await prisma.product.findMany({
        where: { name: productName },
        take: 1,
      });

      return product.length > 0 ? product[0].id : undefined;
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

export const getProductByNameController = new GetProductByNameController();
