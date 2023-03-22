import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class SaveImagesController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { file } = req;
    const { productId } = req.params;
    if (!file?.filename) {
      throw new Error('Obrigatório informar um arquivo.');
    }

    if (!productId) {
      throw new Error('Obrigatório informar o id do produto.');
    }

    try {
      await prisma.image.createMany({
        data: {
          fileName: file.filename,
          productId,
        },
      });

      return res.status(201).json({
        status: 'success',
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
