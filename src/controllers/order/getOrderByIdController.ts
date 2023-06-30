import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetOrdersByIdController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          dateTimeOrder: true,
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
                      id: true,
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
          Order_in_orders_card: {
            select: {
              orders_card: {
                select: {
                  tableNumber: true,
                },
              },
            },
          },
          _count: true,
        },
      });

      if (!order) {
        return res.status(404).send('Order not found!');
      }

      const ordersParsed = {
        ...order,
        statusOrder: order.order_status.status,
        tableNumber: order.Order_in_orders_card[0].orders_card.tableNumber,
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
