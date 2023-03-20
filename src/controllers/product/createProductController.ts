import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';
import { getProductByNameController } from './getProductByNameController';

export class CreateProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price } = req.body;

      const productExists = await getProductByNameController.handle(
        req,
        res,
        name
      );

      if (productExists) {
        return res.status(400).json({
          message: 'Product already exists.',
        });
      }

      res.locals.product = await prisma.product.create({
        data: {
          name,
          description,
          price,
        },
      });

      next();
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

export const createProductController = new CreateProductController();
