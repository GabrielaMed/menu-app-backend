import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetOrdersByIdController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
      const orders = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          dateTimeOrder: true,
          tableNumber: true,
          total: true,
          orderNumber: true,
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

      if (!orders) {
        return res.status(404).send('Order not found!');
      }

      const ordersParsed = {
        ...orders,
        statusOrder: orders.order_status.status,
      };

      return res.status(200).json(ordersParsed);
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

export const getOrdersByIdController = new GetOrdersByIdController();
