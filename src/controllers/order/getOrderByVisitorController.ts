import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetOrderByVisitorController {
  async handle(req: Request, res: Response) {
    const { visitorUuid, companyId } = req.params;

    try {
      const order_card = await prisma.order_in_orders_card.findMany({
        where: {
          orders_card: {
            visitorUuid: {
              equals: visitorUuid,
            },
            companyId: {
              equals: companyId,
            },
            orders_card_status: {
              status: {
                equals: 'aberto',
              },
            },
          },
          order: {
            orderStatusId: {
              equals: 3,
            },
          },
        },
        select: {
          orderId: true,
        },
      });

      if (order_card.length === 0) {
        return res.status(204).send('No orders found!');
      }

      const orders = await prisma.order.findMany({
        where: {
          id: order_card[0].orderId,
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

      const ordersParsed = orders.map((order) => ({
        ...order,
        statusOrder: order.order_status.status,
        Order_products: [
          ...order.Order_products.map((item) => ({
            id: item.id,
            product: item.product,
            observation: item.observation,
            quantity: item.quantity,
            additionals: [
              ...item.Order_additional.map((item) => ({
                ...item.additional,
                quantity: item.quantity,
              })),
            ],
          })),
        ],
      }));

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

export const getOrderByVisitorController = new GetOrderByVisitorController();
