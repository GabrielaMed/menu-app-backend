import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class SaveImagesController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { file } = req;
    const { productId } = req.params;
    if (!file?.filename) {
      return res.status(400).send('Obrigatório informar um arquivo.');
    }

    if (!productId) {
      return res.status(400).send('Obrigatório informar o id do produto.');
    }

    try {
      const product = await prisma.image.create({
        data: {
          fileName: file.filename,
          productId,
        },
        select: {
          fileName: true,
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              Additional_in_Product: {
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
        },
      });

      return res.status(201).json({
        status: 'success',
        ...product,
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

export const saveImagesController = new SaveImagesController();
