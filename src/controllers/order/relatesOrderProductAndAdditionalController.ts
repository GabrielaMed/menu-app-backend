import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesOrderProductAndAdditionalController {
  async handle(req: Request, res: Response) {
    const { orderProductId } = res.locals;
    const { additionals } = req.body;
    let order;

    const filterAdditionals = async (index: number) => {
      if (!additionals[index]) return;

      try {
        order = await prisma.order_additional.create({
          data: {
            additionalId: additionals[index].additionalId,
            orderproductid: orderProductId,
            quantity: additionals[index].quantity,
          },
          select: {
            orderProduct: {
              include: {
                order: {
                  select: {
                    id: true,
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

        if (additionals.length === index + 1) {
          return res.status(201).json(order);
        }

        await filterAdditionals(index + 1);
      } catch (error) {
        if (error instanceof Error) {
          throw new AppError(error.message, 400);
        } else {
          console.log(error);
          return error;
        }
      }
    };

    await filterAdditionals(0);
  }
}

export const relatesOrderProductAndAdditionalController =
  new RelatesOrderProductAndAdditionalController();
