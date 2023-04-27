import { Request, Response } from 'express';
import { AppError } from '../../middlewares/AppErrors';
import { prisma } from '../../database/prismaClient';

export class RelatesOrderAndProductController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.params;
    const { productId, observation, quantity } = req.body;

    try {
      const order = await prisma.order_products.create({
        data: {
          orderId,
          productId,
          observation,
          quantity,
        },
        select: {
          product: true,
          quantity: true,
          observation: true,
          orderId: true,
        },
      });

      return res.status(201).json(order);
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
