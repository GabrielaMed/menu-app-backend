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

      const order_cart = await prisma.order_in_orders_card.findMany({
        where: {
          orders_card: {
            visitorUuid: {
              equals: visitorUuid,
            },
            orders_card_status: {
              status: {
                equals: 'aberto',
              },
            },
            companyId: {
              equals: companyId,
            },
          },
        },
        select: {
          order: {
            select: {
              id: true,
            },
          },
          orders_card: {
            select: {
              tableNumber: true,
            },
          },
        },
      });

      const orderProducts = await prisma.order.findMany({
        where: { id: order_cart[0].order.id },
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

      const orderProductsParsed = orderProducts?.map((order) => ({
        ...order,
        statusOrder: order.order_status.status,
        tableNumber: order_cart[0].orders_card.tableNumber,
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
