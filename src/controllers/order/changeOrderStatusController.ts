import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class ChangeOrderStatusController {
  async handle(req: Request, res: Response) {
    try {
      const { newStatusOrder } = req.body;
      const { orderId } = req.params;

      const orderStatus = await prisma.order_status.findMany({
        where: {
          status: newStatusOrder,
        },
        take: 1,
      });

      const response = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderStatusId: orderStatus[0].id,
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
          _count: true,
        },
      });

      if (!response) {
        return res.status(404).send('Order not found!');
      }

      const ordersParsed = {
        ...response,
        statusOrder: response.order_status.status,
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

export const changeOrderStatusController = new ChangeOrderStatusController();
