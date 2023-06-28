import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class CreateOrderController {
  async handle(req: Request, res: Response) {
    try {
      const { statusOrder } = req.body;

      const orderStatus = await prisma.order_status.findMany({
        where: {
          status: statusOrder,
        },
        take: 1,
      });

      const response = await prisma.order.create({
        data: {
          orderStatusId: orderStatus[0].id,
          dateTimeOrder: new Date(),
          total: 0.0,
        },
      });

      res.status(201).json({
        status: 'Order Created Succesfully',
        order: response,
      });
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

export const createOrderController = new CreateOrderController();
