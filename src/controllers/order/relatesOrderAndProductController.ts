import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesOrderAndProductController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;
    const { productId, observation, quantity, additionals } = req.body;

    try {
      const product_order = await prisma.order_products.create({
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
      });

      res.locals.orderProductId = product_order.order.Order_products.filter(
        (item) => item.product.id === productId
      )[0].id;

      if (additionals.length > 0) {
        next();
      } else {
        return res.status(201).json(product_order);
      }
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
