import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class UpdateOrderController {
  async handle(req: Request, res: Response) {
    try {
      const { newStatusOrder, products } = req.body;
      const { orderId } = req.params;

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          statusOrder: newStatusOrder,
        },
      });

      const filterProducts = async (index: number) => {
        if (!products[index]) return;
        await prisma.order_products.updateMany({
          where: {
            id: products[index].orderProductId,
          },
          data: {
            quantity: products[index].quantity,
          },
        });

        await filterProducts(index + 1);
      };

      await filterProducts(0);

      res.status(200).send('Order sent successfuly');
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

export const updateOrderController = new UpdateOrderController();
