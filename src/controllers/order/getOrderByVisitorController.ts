import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class GetOrderByVisitorController {
  async handle(req: Request, res: Response) {
    const { visitorUuid, companyId } = req.params;

    try {
      const order = await prisma.order.findMany({
        where: {
          visitorUuid,
          companyId,
        },
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
              id: true,
              observation: true,
              quantity: true,
              product: {
                select: {
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

      if (order.length === 0) {
        return res.status(404).send('Order not found!');
      }

      return res.status(200).json(order);
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
