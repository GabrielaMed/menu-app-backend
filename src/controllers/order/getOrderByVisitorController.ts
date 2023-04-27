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
