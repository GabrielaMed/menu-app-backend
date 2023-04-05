import { Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';

class GetProductImagesController {
  async handle(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const productImage = await prisma.image.findMany({
        where: {
          productId,
        },
      });

      if (productImage.length === 0) {
        return res.status(404).send('Image not found!');
      }

      return res.status(200).json(productImage);
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

export const getProductImagesController = new GetProductImagesController();
