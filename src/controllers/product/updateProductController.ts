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
        const productExistsId = await getProductByNameController.handle(
          req,
          res,
          data.name,
          companyId
        );

        if (productExistsId && productExistsId !== productId) {
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
          Image: {
            select: {
              fileName: true,
              id: true,
            },
          },
        },
      });

      res.status(200).json({
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
