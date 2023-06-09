import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../database/prismaClient';
import { AppError } from '../../middlewares/AppErrors';
import { getProductByNameController } from './getProductByNameController';

export class CreateProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price } = req.body;
      const { companyId } = req.params;

      const productExists = await getProductByNameController.handle(
        req,
        res,
        name,
        companyId
      );

      if (productExists) {
        return res.status(400).send('Product already exists.');
      }

      const response = await prisma.product.create({
        data: {
          name,
          description,
          price,
          companyId,
        },
      });

      res.status(201).json({
        status: 'Created Succesfully',
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

export const createProductController = new CreateProductController();
