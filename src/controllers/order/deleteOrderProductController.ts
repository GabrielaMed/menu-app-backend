import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class DeleteOrderProductController {
  async handle(req: Request, res: Response) {
    try {
      const { newStatusOrder, products } = req.body;
      const { orderId } = req.params;
      console.log('PRODUCTDS', products);

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          statusOrder: newStatusOrder,
        },
      });

      const response = await prisma.order_products.deleteMany({
        where: {
          id: { in: products.map((item: any) => item.orderProductId) },
        },
      });

      console.log('>>>>>>', response);

      res.status(204);
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
