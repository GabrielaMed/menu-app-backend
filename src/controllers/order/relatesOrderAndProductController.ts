import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesOrderAndProductController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.params;
    const { productId, observation, quantity } = req.body;

    try {
      const order = await prisma.order_products.create({
        data: {
          orderId,
          productId,
          observation,
          quantity,
        },
        select: {
          order: {
            select: {
              id: true,
              Order_additional: {
                select: {
                  additional: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                    },
                  },
                },
              },
              Order_products: {
                select: {
                  observation: true,
                  quantity: true,
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
              statusOrder: true,
              _count: true,
            },
          },
        },
      });

      return res.status(201).json(order);
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

export const relatesOrderAndProductController =
  new RelatesOrderAndProductController();
