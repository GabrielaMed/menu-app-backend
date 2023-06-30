import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class RelatesOrdersAndOrdersCardController {
  async handle(orderId: string, ordersCardId: number) {
    try {
      const response = await prisma.order_in_orders_card.create({
        data: {
          orderId,
          ordersCardId,
        },
        select: {
          order: {
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
          },
        },
      });

      return response;
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

export const relatesOrdersAndOrdersCardController =
  new RelatesOrdersAndOrdersCardController();
