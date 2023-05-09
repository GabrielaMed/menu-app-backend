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

      const productToRemove = products.filter(
        (product: any) => product.quantity === 0
      );
      if (productToRemove.length > 0) {
        const res = await prisma.order_products.deleteMany({
          where: {
            id: { in: productToRemove.map((item: any) => item.productId) },
          },
        });

        console.log('>>>>>>', res);
      } else {
        const res = await prisma.order_products.updateMany({
          where: {
            id: { in: products.map((item: any) => item.productId) },
          },
          data: {
            quantity: {
              set: products.map((item: any) => ({
                where: { productId: item.productId },
                value: item.quantity,
              })),
            },
          },
        });

        console.log('>>>', res);
      }

      res.status(200).send('Order sent successfuly');
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

export const updateOrderController = new UpdateOrderController();
