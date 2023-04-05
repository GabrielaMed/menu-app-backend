import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetProductByIdController {
  async handle(req: Request, res: Response) {
    const { productId, companyId } = req.params;

    try {
      const product = await prisma.product.findMany({
        where: {
          id: productId,
          companyId,
        },
      });

      if (product.length === 0) {
        return res.status(404).send('Product not found!');
      }

      return res.status(200).json(product);
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

export const getProductByIdController = new GetProductByIdController();
