import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesOrderProductAndAdditionalController {
  async handle(req: Request, res: Response) {
    const { additionalId, orderProductId } = req.params;

    try {
      const order = await prisma.order_additional.create({
        data: {
          additionalId,
          orderProductId,
        },
        select: {
          orderProduct: {
            include: {
              order: {
                select: {
                  Order_products: {
                    select: {
                      id: true,
                      observation: true,
                      quantity: true,
                      product: {
                        select: {
                          name: true,
                          description: true,
                          id: true,
                          price: true,
                          Image: {
                            select: {
                              fileName: true,
                            },
                          },
                        },
                      },
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
                    },
                  },
                  _count: true,
                  statusOrder: true,
                },
              },
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

export const relatesOrderProductAndAdditionalController =
  new RelatesOrderProductAndAdditionalController();
