import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';
import { Order_status } from '@prisma/client';

export class GetOrdersByCompanyIdController {
  async handle(req: Request, res: Response) {
    const { companyId } = req.params;

    try {
      const orders = await prisma.order.findMany({
        where: {
          companyId,
        },
        orderBy: {
          dateTimeOrder: 'desc',
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

export const getOrdersByCompanyIdController =
  new GetOrdersByCompanyIdController();