import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';
import { getProductByNameController } from './getProductByNameController';

export class UpdateProductController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { ...data } = req.body;
      const { companyId, productId } = req.params;

      if (data.name) {
        const productExists = await getProductByNameController.handle(
          req,
          res,
          data.name,
          companyId
        );

        if (productExists) {
          return res.status(400).send('Product already exists.');
        }
      }

      const response = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...data,
        },
      });

      res.status(201).json({
        status: 'Updated Succesfully',
        product: response,
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

export const updateProductController = new UpdateProductController();
