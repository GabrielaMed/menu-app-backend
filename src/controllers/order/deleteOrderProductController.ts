import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class DeleteOrderProductController {
  async handle(req: Request, res: Response) {
    try {
      const { orderProductId } = req.body;

      await prisma.order_products.deleteMany({
        where: {
          id: orderProductId,
        },
      });

      res.status(204).send('Product deleted!');
    } catch (error) {
      console.log('EROROO', error);
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      } else {
        console.log(error);
        return error;
      }
    }
  }
}

export const deleteOrderProductController = new DeleteOrderProductController();
