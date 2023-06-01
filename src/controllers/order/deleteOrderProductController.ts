import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class DeleteOrderProductController {
  async handle(req: Request, res: Response) {
    try {
      const { orderProductId, visitorUuid, companyId } = req.body;

      await prisma.order_products.deleteMany({
        where: {
          id: orderProductId,
        },
      });

      const orderProducts = await prisma.order.findMany({
        where: {
          visitorUuid,
          companyId,
        },
        select: {
          id: true,
          Order_products: {
            select: {
              id: true,
              observation: true,
              quantity: true,
              Order_additional: {
                select: {
                  additional: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                    },
                  },
                  quantity: true,
                },
              },
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  Image: {
                    select: {
                      fileName: true,
                    },
                  },
                },
              },
            },
          },
          order_status: {
            select: {
              status: true,
            },
          },
          _count: true,
        },
      });

      const orderProductsParsed = orderProducts.map((order) => ({
        ...order,
        statusOrder: order.order_status.status,
      }));

      res.status(200).json(orderProductsParsed);
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
