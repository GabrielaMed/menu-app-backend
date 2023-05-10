import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class UpdateOrderController {
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

      const productToRemove = products.filter(
        (product: any) => product.quantity === 0
      );
      if (productToRemove.length > 0) {
        await prisma.order_additional.deleteMany({
          where: {
            orderproductid: {
              in: productToRemove.map((item: any) => item.orderProductId),
            },
          },
        });
        const res = await prisma.order_products.deleteMany({
          where: {
            id: { in: productToRemove.map((item: any) => item.orderProductId) },
          },
        });

        console.log('>>>>>>', res);
      } else {
        const filterProducts = async (index: number) => {
          if (!products[index]) return;
          const res = await prisma.order_products.updateMany({
            where: {
              id: products[index].orderProductId,
            },
            data: {
              quantity: products[index].quantity,
            },
          });

          console.log('>>>', res);

          await filterProducts(index + 1);
        };

        await filterProducts(0);
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
