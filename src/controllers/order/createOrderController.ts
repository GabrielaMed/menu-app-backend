import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class CreateOrderController {
  async handle(req: Request, res: Response) {
    try {
      const { companyId, visitorUuid, statusOrder } = req.body;

      const response = await prisma.order.create({
        data: {
          companyId,
          visitorUuid,
          statusOrder,
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
