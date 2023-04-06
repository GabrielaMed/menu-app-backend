import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesAdditionalProductController {
  async handle(req: Request, res: Response) {
    try {
      let { productId, additionalId } = req.params;

      const relation = await prisma.additional_in_Product.create({
        data: {
          additionalId,
          productId,
        },
      });

      res.status(201).json({
        status: 'Created Succesfully',
        product: relation,
      });
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

export const relatesAdditionalProductController =
  new RelatesAdditionalProductController();
