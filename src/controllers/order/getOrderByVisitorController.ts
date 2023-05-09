import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetOrderByVisitorController {
  async handle(req: Request, res: Response) {
    const { visitorUuid, companyId } = req.params;

    try {
      const orders = await prisma.order.findMany({
        where: {
          visitorUuid,
          companyId,
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
                    },
                  },
                },
              },
            },
          },
          statusOrder: true,
          _count: true,
        },
      });

      const ordersParsed = orders.map((order) => ({
        ...order,
        Order_products: [
          ...order.Order_products.map((item) => ({
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

      if (orders.length === 0) {
        return res.status(404).send('Order not found!');
      }

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
