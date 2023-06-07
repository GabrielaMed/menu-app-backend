import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

export class DeleteImageByIdController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { imageId } = req.params;
    if (!imageId) {
      return res.status(400).send('Obrigatório informar o id da imagem.');
    }

    try {
      await prisma.image.delete({
        where: {
          id: imageId,
        },
      });

      return res.status(200).send('success');
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

export const deleteImageByIdController = new DeleteImageByIdController();
