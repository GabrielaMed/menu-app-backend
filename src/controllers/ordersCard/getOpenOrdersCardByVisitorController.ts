import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';
import { relatesOrdersAndOrdersCardController } from './relatesOrdersAndOrdersCardController';

export class GetOpenOrdersCardByVisitorController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { tableNumber, companyId } = req.body;
    const { visitorUuid } = req.params;

    try {
      const orders_card = await prisma.orders_card.findMany({
        where: {
          tableNumber,
          visitorUuid,
          companyId,
          ordersCardStatusId: 1,
        },
        select: {
          id: true,
        },
      });

      if (orders_card.length === 0) {
        return next();
      }

      const order = await prisma.order.create({
        data: {
          orderStatusId: 3,
          dateTimeOrder: new Date(),
          total: 0.0,
        },
      });

      const relates = relatesOrdersAndOrdersCardController.handle(
        order.id,
        orders_card[0].id
      );

      return res.status(200).json(relates);
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

export const getOpenOrdersCardByVisitorController =
  new GetOpenOrdersCardByVisitorController();
