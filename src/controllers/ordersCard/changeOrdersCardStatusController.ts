import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class ChangeOrdersCardStatusController {
  async handle(req: Request, res: Response) {
    try {
      const { newStatus } = req.body;
      const { ordersCardId } = req.params;

      const ordersCardStatus = await prisma.orders_card_status.findMany({
        where: {
          status: newStatus,
        },
        take: 1,
      });

      const response = await prisma.orders_card.update({
        where: {
          id: Number(ordersCardId),
        },
        data: {
          ordersCardStatusId: ordersCardStatus[0].id,
        },
      });

      if (!response) {
        return res.status(404).send('Order Card not found!');
      }

      return res.status(200).json(response);
    } catch (error) {
      console.log('ERRORR', error);

      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      } else {
        console.log(error);
        return error;
      }
    }
  }
}

export const changeOrdersCardStatusController =
  new ChangeOrdersCardStatusController();
